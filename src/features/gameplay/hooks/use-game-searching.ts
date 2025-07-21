import { useEffect, useMemo, useRef, useState } from "react"
import usePlayer from "./use-player"
import { useCountdown } from "usehooks-ts"
import { RealtimeChannel } from "@supabase/supabase-js"
import { createGame, deleteGameById, startGameIfExists } from "../server-actions/games-actions"
import { ChessTimerOption } from "../types"
import { supabase } from "@/utils/supabase/client"
import { Game } from "@/db/types"
import isError from "@/utils/is-error"
import timerFormat from "@/utils/timer-format"

export default function useGameSearching({
    timerOption,
    maxDuration ,
    onGameFound ,
    onGameCanceled
}:{
    timerOption : ChessTimerOption
    maxDuration?: number
    onGameFound : (game:Game) => void
    onGameCanceled?: (gameId:string) => void
}) {
    const [count, { startCountdown, resetCountdown }] = useCountdown({
        countStart: 0,
        intervalMs: 1000,
        isIncrement: true,
        countStop: maxDuration || Infinity
    })
    const MULTIPLAYER_PATH = "play/multiplayer/"
    const [isSearching, setIsSearching] = useState(false)
    // const router = useRouter()

    const [error, setError] = useState<null|Error>(null)
    const [createdGameId, setCreatedGameId] = useState<string | null>(null)
    // const dispatch = useAppDispatch()
    // const { timer } = useAppSelector(selectMultiplayerOptions)
    const player = usePlayer()
    const channelRef = useRef<RealtimeChannel>(null)
    const hasSearched = useRef(false)

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

                const startedGame = await startGameIfExists({
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
                                console.log("New game data:", payload.new)

                                const newGame = payload.new as Game

                                // Clean up subscription before redirecting
                                if (channelRef.current) {
                                    channelRef.current.unsubscribe()
                                    channelRef.current = null
                                }

                                setIsSearching(false)
                                onGameFound(newGame)
                                // console.log('after router.push')

                                // router.push(MULTIPLAYER_PATH + newGame.id)
                                // console.log('after router.push')
                            }
                        )
                        .subscribe((status) => {
                            console.log("Subscription status:", status)
                            if (status === "SUBSCRIBED") {
                                console.log(
                                    "Subscription is now active and ready!"
                                )
                            } else if (status === "CHANNEL_ERROR") {
                                console.error("Subscription error")
                            } else if (status === "TIMED_OUT") {
                                console.error("Subscription timed out")
                            } else if (status === "CLOSED") {
                                console.log("Subscription closed")
                            }
                        })

                    // Store channel reference for cleanup
                    channelRef.current = channel
                } else {
                    console.log("Found existing game:", startedGame.id)
                    setIsSearching(false)
                    onGameFound(startedGame)
                    // router.push(MULTIPLAYER_PATH + startedGame.id)
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
    }, [isSearching, player.type, timerOption])

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
                console.log('game deleted')
                onGameCanceled?.(createdGameId)
                setCreatedGameId(null)
            }
        }
    }

    function startSearch() {
        setIsSearching(true)
    }

    const searchTimer = useMemo(()=>timerFormat(count*1000),[count])
    

    return {
        error,
        count,
        searchTimer,
        isSearching,
        cancelSearch,
        startSearch
    }

}