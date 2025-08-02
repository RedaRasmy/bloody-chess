import { useEffect, useMemo, useRef, useState } from "react"
import usePlayer from "./use-player"
import { useCountdown } from "usehooks-ts"
import { RealtimeChannel } from "@supabase/supabase-js"
import {
    createGame,
    deleteGameById,
    getGameById,
    matchGameIfExist,
} from "../../gameplay/server-actions/games-actions"
import { ChessTimerOption } from "../../gameplay/types"
import { supabase } from "@/utils/supabase/client"
import { Guest, Player, MatchedGame } from "@/db/types"
import isError from "@/utils/is-error"
import timerFormat from "@/utils/timer-format"
import { supabaseToTypescript } from "@/utils/snake_to_camel_case"
import { serializeTimestamps } from "@/utils/serialize"

type SearchState =
    | "idle"
    | "matching"
    | "creating-game"
    | "waiting-for-opponent"
    | "game-found"

const MAX_RETRIES = 3
const RETRY_DELAYS = [1000, 2000, 4000]

// in a client game-searching flow : waiting-for-opponent can not exist with creating-game
// white player flow : idle -> matching -> creating-game -> waiting-for-opponent -> game-found -> callback
// black player flow -> idle -> matching -> game-found -> callback

export default function useGameSearching({
    timerOption,
    maxDuration,
    onGameFound,
    onGameCanceled,
}: {
    timerOption: ChessTimerOption
    maxDuration?: number
    onGameFound?: (
        game: MatchedGame,
        player: {
            type: "player" | "guest"
            data: Player | Guest
        }
    ) => Promise<void>
    onGameCanceled?: (gameId: string) => Promise<void>
}) {
    const [count, { startCountdown, resetCountdown }] = useCountdown({
        countStart: 0,
        intervalMs: 1000,
        isIncrement: true,
        countStop: maxDuration || Infinity,
    })

    const [searchState, setSearchState] = useState<SearchState>("idle")
    const [error, setError] = useState<null | Error>(null)
    const [createdGameId, setCreatedGameId] = useState<string | null>(null)
    const [retryCount, setRetryCount] = useState(0)

    const player = usePlayer()
    const channelRef = useRef<RealtimeChannel | null>(null)

    const isSearching = searchState !== "idle" && searchState !== "game-found"

    // Cleanup subscription on unmount
    useEffect(() => {
        return () => {
            cleanupSubscription()
        }
    }, [])

    // Main search effect
    useEffect(() => {
        if (player.type === "loading" || !isSearching) return

        // Use cancellation pattern instead of ref
        let cancelled = false

        async function search() {
            if (cancelled) return
            await handleSearch()
        }

        search()

        return () => {
            cancelled = true
        }
    }, [isSearching, player.type])

    function cleanupSubscription() {
        if (channelRef.current) {
            console.log("Unsubscribing from channel")
            channelRef.current.unsubscribe()
            channelRef.current = null
        }
    }

    async function handleSearch() {
        if (player.type === "loading") return

        const { type, data } = player
        startCountdown()

        try {
            console.log("Starting search...")
            setSearchState("matching")

            // Step 1: Try to match existing game
            const existingGame = await matchGameIfExist({
                playerId: data.id,
                isForGuests: type === "guest",
                timerOption,
            })

            if (existingGame) {
                // Found existing game - we're the black player
                console.log("Found existing game, joining as black player")
                setSearchState("game-found")
                await onGameFound?.(existingGame, { type, data })
                return
            }

            // Step 2: No existing game found, we need to create one and wait
            console.log(
                "No waiting game found, setting up subscription first..."
            )
            setSearchState("creating-game")

            // Step 3: Create game
            console.log("Creating game...")
            const createdGame = await createGame({
                playerId: data.id,
                timerOption,
                isForGuests: type === "guest",
            })
            console.log("Game created")

            setCreatedGameId(createdGame.id)
            setSearchState("waiting-for-opponent")

            // Step 4: setup subscription
            console.log("Setting up subscription for game:", createdGame.id)
            await setupGameSubscriptionWithRetry(createdGame.id, type, data)
        } catch (error) {
            console.error("Search error:", error)
            handleSearchError(error)
        }
    }

    async function setupGameSubscriptionWithRetry(
        gameId: string,
        playerType: "player" | "guest",
        playerData: Player | Guest
    ): Promise<void> {
        for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
            try {
                console.log(
                    `Subscription attempt ${attempt + 1}/${MAX_RETRIES + 1}`
                )
                await setupGameSubscription(gameId, playerType, playerData)
                setRetryCount(0) // Reset on success
                return // Success!
            } catch (error) {
                console.error(
                    `Subscription attempt ${attempt + 1} failed:`,
                    error
                )

                if (attempt === MAX_RETRIES) {
                    // Final attempt failed - give up and use polling
                    console.log(
                        "All subscription attempts failed, relying on polling fallback"
                    )
                    throw error
                }

                // Update retry count before waiting
                setRetryCount(attempt + 1)

                // Wait before retrying
                const delay = RETRY_DELAYS[attempt] || 4000
                console.log(`Retrying subscription in ${delay}ms...`)
                await new Promise((resolve) => setTimeout(resolve, delay))
            }
        }
    }

    async function setupGameSubscription(
        gameId: string,
        playerType: "player" | "guest",
        playerData: Player | Guest
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            cleanupSubscription()

            const channelName = `game-${gameId}`
            console.log("Setting up game subscription for:", channelName)

            const timeoutId = setTimeout(() => {
                reject(new Error("Subscription setup timed out"))
            }, 10000) // 10 second timeout

            const channel = supabase
                .channel(channelName)
                .on(
                    "postgres_changes",
                    {
                        event: "UPDATE",
                        schema: "public",
                        table: "games",
                        filter: `id=eq.${gameId}`,
                    },
                    (payload) => {
                        console.log("=== GAME UPDATE RECEIVED ===")
                        console.log("Payload:", payload)

                        const updatedGame = supabaseToTypescript<MatchedGame>(
                            payload.new
                        )

                        if (updatedGame.blackId) {
                            console.log("Game matched!")

                            cleanupSubscription()
                            setSearchState("game-found")
                            onGameFound?.(updatedGame, {
                                type: playerType,
                                data: playerData,
                            })
                        }
                    }
                )
                .subscribe((status, err) => {
                    console.log("Game subscription status:", status)
                    clearTimeout(timeoutId)
                    if (status === "SUBSCRIBED") {
                        console.log("Game subscription active!")
                        resolve() // Subscription is ready
                    } else if (status === "CHANNEL_ERROR") {
                        console.error("Game subscription error:", err)
                        reject(new Error("Game subscription failed"))
                    } else if (status === "TIMED_OUT") {
                        console.error("Game subscription timed out")
                        reject(new Error("Game subscription timed out"))
                    }
                })

            channelRef.current = channel
        })
    }

    // Poll fallback
    useEffect(() => {
        if (
            player.type !== "loading" &&
            searchState === "waiting-for-opponent" &&
            createdGameId
        ) {
            const { type, data } = player

            // Longer fallback since we now have subscription retries
            const pollbackup = setTimeout(async () => {
                console.log("Polling fallback - checking game status...")
                try {
                    const game = await getGameById(createdGameId)
                    if (game && game.blackId) {
                        console.log("Polling fallback found matched game!")
                        setSearchState("game-found")
                        console.log('matched game :',game)
                        onGameFound?.(
                            serializeTimestamps(game) as MatchedGame,
                            { type, data }
                        )
                    }
                } catch (error) {
                    console.error("Polling fallback error:", error)
                }
            }, 8000)

            return () => clearTimeout(pollbackup)
        }
    }, [searchState, createdGameId, player.type])

    function handleSearchError(error: unknown) {
        console.error("Search error:", error)
        if (isError(error)) {
            setError(error)
        }
        setSearchState("idle")
        setRetryCount(0)
    }

    async function cancelSearch() {
        if (!isSearching) return

        console.log("Cancelling search...")
        resetCountdown()

        // Clean up subscription
        cleanupSubscription()

        // Delete created game if exists
        if (createdGameId) {
            try {
                await deleteGameById(createdGameId)
                console.log("Game deleted:", createdGameId)
                await onGameCanceled?.(createdGameId)
            } catch (error) {
                console.error("Error deleting game:", error)
            }
            setCreatedGameId(null)
        }

        setSearchState("idle")
        setRetryCount(0)
        setError(null)
    }

    function startSearch() {
        if (player.type === "loading") return

        setError(null)
        setRetryCount(0)
        setSearchState("matching")
    }

    const searchTimer = useMemo(() => timerFormat(count * 1000), [count])

    return {
        error,
        count,
        searchTimer,
        isSearching,
        searchState, 
        cancelSearch,
        retryCount,
        startSearch,
    }
}
