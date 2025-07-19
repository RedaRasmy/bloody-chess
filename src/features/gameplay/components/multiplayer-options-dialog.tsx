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
import { useState, useEffect } from "react"
// import delay from "@/utils/delay"
import { supabase } from "@/utils/supabase/client"
import {
    createGame,
    startGameIfExists,
    deleteGameById,
} from "../server-actions/games-actions"
import usePlayer from "@/features/gameplay/hooks/use-player"
import { useRouter } from "next/navigation"

export default function MultiplayerOptionsDialog() {
    const [isSearching, setIsSearching] = useState(false)
    const router = useRouter()

    // const [gameFound, setGameFound] = useState(false)
    const [createdGameId, setCreatedGameId] = useState<string | null>(null)
    const dispatch = useAppDispatch()
    const { timer } = useAppSelector(selectMultiplayerOptions)
    const player = usePlayer()

    useEffect(() => {
        if (player.type === "loading") return

        const { type, data } = player

        async function handelSearch() {
            // ideas :
            // check if there is a not-started game in db
            // if exist update it to 'playing' and redirect to /multiplayer/gameId
            // else create a new game with 'not-started' and wait for someone else to update it

            const startedGame = await startGameIfExists({
                playerId: data.id,
                isForGuests: type === "guest",
            })

            if (!startedGame) {
                const createdGame = await createGame({
                    playerId: data.id,
                    timer,
                    isForGuests: type === "guest",
                })
                setCreatedGameId(createdGame.id)
                // wait for someone else to start the game
                supabase
                    .channel("game-searching")
                    .on(
                        "postgres_changes",
                        {
                            event: "UPDATE",
                            schema: "public",
                            table: "games",
                            filter: "id=eq." + createdGame.id,
                        },
                        (payload) => {
                            const newGame = payload.new
                            setIsSearching(false)
                            router.push("/multiplayer/" + newGame.id)
                            console.log(
                                "new game (uptaded by someone else) : ",
                                payload.new
                            )
                        }
                    )
                    .subscribe()
            } else {
                setIsSearching(false)
                router.push("/multiplayer/" + startedGame.id)
            }
            // await delay(3000).then(() => {
            //     // dispatch(replay())
            //     setIsSearching(false)
            // })
        }

        handelSearch()
    }, [isSearching, player])

    async function handleCancel() {
        if (isSearching) {
            setIsSearching(false)
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
