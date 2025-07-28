import { useEffect, useMemo, useRef, useState } from "react"
import usePlayer from "./use-player"
import { useCountdown } from "usehooks-ts"
import { RealtimeChannel } from "@supabase/supabase-js"
import {
    createGame,
    deleteGameById,
    matchGameIfExist,
} from "../../gameplay/server-actions/games-actions"
import { ChessTimerOption } from "../../gameplay/types"
import { supabase } from "@/utils/supabase/client"
import { Guest, Player, StartedGame } from "@/db/types"
import isError from "@/utils/is-error"
import timerFormat from "@/utils/timer-format"
import { supabaseToTypescript } from "@/utils/snake_to_camel_case"

export default function useGameSearching({
    timerOption,
    maxDuration,
    onGameFound,
    onGameCanceled,
}: {
    timerOption: ChessTimerOption
    maxDuration?: number
    onGameFound?: (
        game: StartedGame,
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
    const [isSearching, setIsSearching] = useState(false)

    const [error, setError] = useState<null | Error>(null)
    const [createdGameId, setCreatedGameId] = useState<string | null>(null)
    const player = usePlayer()
    const channelRef = useRef<RealtimeChannel>(null)
    const hasSearched = useRef(false)
    const [retryAttempts, setRetryAttempts] = useState(0)
    const MAX_RETRIES = 5

    // Cleanup subscription on unmount
    useEffect(() => {
        return () => {
            if (channelRef.current) {
                console.log("Unsubscribing from channel")
                channelRef.current.unsubscribe()
                channelRef.current = null
            }
        }
    }, [])

    useEffect(() => {
        if (player.type === "loading") return
        if (!isSearching) {
            hasSearched.current = false // Reset when not searching
            return
        }
        if (hasSearched.current) return // Prevent multiple searches

        hasSearched.current = true
        const { type, data } = player

        async function handelSearch() {
            startCountdown()
            try {
                console.log("Starting search...")

                const startedGame = await matchGameIfExist({
                    playerId: data.id,
                    isForGuests: type === "guest",
                    timerOption,
                })

                if (!startedGame) {
                    console.log("No waiting game found, creating new one...")

                    const createdGame = await createGame({
                        playerId: data.id,
                        timerOption,
                        isForGuests: type === "guest",
                    })

                    setCreatedGameId(createdGame.id)
                    console.log("Created game with ID:", createdGame.id)

                    // Create unique channel name to avoid conflicts
                    const channelName = `game-searching-${createdGame.id}`

                    // Clean up any existing subscription
                    if (channelRef.current) {
                        channelRef.current.unsubscribe()
                    }

                    // Create new subscription
                    const delay = Math.min(
                        1000 * Math.pow(2, retryAttempts),
                        30000
                    ) // Cap at 30s
                    setTimeout(
                        () => {
                            const channel = supabase
                                .channel(channelName)
                                .on(
                                    "postgres_changes",
                                    {
                                        event: "*",
                                        schema: "public",
                                        table: "games",
                                        filter: `id=eq.${createdGame.id}`,
                                    },
                                    (payload) => {
                                        console.log("=== RECEIVED UPDATE ===")
                                        console.log("Payload:", payload)

                                        const newGame =
                                            supabaseToTypescript<StartedGame>(
                                                payload.new
                                            )

                                        console.log(
                                            "New game data:",
                                            payload.new
                                        )

                                        // Clean up subscription before redirecting
                                        if (channelRef.current) {
                                            channelRef.current.unsubscribe()
                                            channelRef.current = null
                                        }

                                        setIsSearching(false)
                                        onGameFound?.(newGame, { type, data })
                                    }
                                )
                                .subscribe((status, err) => {
                                    console.log("Subscription status:", status)
                                    if (status === "SUBSCRIBED") {
                                        console.log(
                                            "Subscription is now active and ready!"
                                        )
                                        setRetryAttempts(0)
                                    } else if (status === "CHANNEL_ERROR") {
                                        console.error(
                                            "Subscription error : ",
                                            err
                                        )
                                        console.log(
                                            `Retry ${
                                                retryAttempts + 1
                                            }/${MAX_RETRIES} in ${delay}ms`
                                        )
                                        setRetryAttempts((prevAttempts) => {
                                            if (prevAttempts < MAX_RETRIES) {
                                                return prevAttempts + 1 // This will trigger useEffect to retry
                                            }
                                            return prevAttempts
                                        })
                                    } else if (status === "TIMED_OUT") {
                                        console.error("Subscription timed out")
                                    } else if (status === "CLOSED") {
                                        console.log("Subscription closed")
                                    }
                                })
                            channelRef.current = channel
                        },
                        retryAttempts === 0 ? 0 : delay
                    )

                    // Store channel reference for cleanup
                } else {
                    setIsSearching(false)
                    await onGameFound?.(startedGame, { type, data })
                }
            } catch (error) {
                console.error("Search error:", error)
                if (isError(error)) {
                    setError(error)
                }
                setIsSearching(false)
                hasSearched.current = false
            }
        }

        handelSearch()
    }, [isSearching, player.type, timerOption, retryAttempts])

    async function cancelSearch() {
        if (isSearching) {
            resetCountdown()
            console.log("Cancelling search...")

            // Clean up subscription
            if (channelRef.current) {
                channelRef.current.unsubscribe()
                channelRef.current = null
            }

            setIsSearching(false)
            hasSearched.current = false
            if (createdGameId) {
                await deleteGameById(createdGameId)
                console.log("game deleted")
                onGameCanceled?.(createdGameId)
                setCreatedGameId(null)
            }
        }
    }

    function startSearch() {
        setIsSearching(true)
    }

    const searchTimer = useMemo(() => timerFormat(count * 1000), [count])

    return {
        error,
        count,
        searchTimer,
        isSearching,
        cancelSearch,
        startSearch,
    }
}
