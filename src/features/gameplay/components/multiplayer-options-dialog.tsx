"use client"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import {
    changeTimer,
    selectMultiplayerOptions,
} from "@/redux/slices/game-options"
// import { Link } from "@/i18n/navigation"
import SelectTimer from "./select-timer"
import { TIMER_OPTIONS } from "../utils/constantes"
// import { replay } from "@/redux/slices/game-slice"
import { useState, useEffect, useRef } from "react"
// import delay from "@/utils/delay"
import { supabase } from "@/utils/supabase/client"
import {
    createGame,
    startGameIfExists,
    deleteGameById,
} from "../server-actions/games-actions"
import usePlayer from "@/features/gameplay/hooks/use-player"
import { useRouter } from "next/navigation"
import { RealtimeChannel } from "@supabase/supabase-js"
import {Game} from '@/db/types'

export default function MultiplayerOptionsDialog() {
    const [isSearching, setIsSearching] = useState(false)
    const router = useRouter()

    // const [gameFound, setGameFound] = useState(false)
    const [createdGameId, setCreatedGameId] = useState<string | null>(null)
    const dispatch = useAppDispatch()
    const { timer } = useAppSelector(selectMultiplayerOptions)
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
            try {
                console.log("Starting search...")
                
                const startedGame = await startGameIfExists({
                    playerId: data.id,
                    isForGuests: type === "guest",
                })

                if (!startedGame) {
                    console.log("No waiting game found, creating new one...")
                    
                    const createdGame = await createGame({
                        playerId: data.id,
                        timer,
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
                                router.push("/multiplayer/" + newGame.id)
                            }
                        )
                        .subscribe((status) => {
                            console.log("Subscription status:", status)
                            if (status === "SUBSCRIBED") {
                                console.log("Subscription is now active and ready!")
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
                    router.push("/multiplayer/" + startedGame.id)
                }
            } catch (error) {
                console.error("Search error:", error)
                setIsSearching(false)
                hasSearched.current = false
            }
        }

        handelSearch()
    }, [isSearching, player.type, timer])

    async function handleCancel() {
        if (isSearching) {
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
                setCreatedGameId(null)
            }
        }
    }

    return (
        <Dialog onOpenChange={handleCancel}>
            <DialogTrigger asChild>
                <Button className="lg:w-sm w-50 py-6 cursor-pointer">
                    Play Online
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] ">
                <DialogHeader>
                    <DialogTitle>Multiplayer game setup</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <SelectTimer
                        required
                        options={[...TIMER_OPTIONS]}
                        value={timer}
                        onChange={(op) => dispatch(changeTimer(op))}
                    />
                </div>
                {isSearching && (
                    <p className="font-semibold">Searching a game ...</p>
                )}
                <DialogFooter>
                    {isSearching && (
                        <Button onClick={handleCancel}>Cancel</Button>
                    )}
                    <Button
                        disabled={isSearching}
                        className=""
                        onClick={() => {
                            setIsSearching(true)
                        }}
                    >
                        Start
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
