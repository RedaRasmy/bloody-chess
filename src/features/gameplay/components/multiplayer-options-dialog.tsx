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
import { replay } from "@/redux/slices/game-slice"
import { useState } from "react"
import delay from "@/utils/delay"
// import {supabase} from '@/utils/supabase/client'
import createGame from '../server-actions/create-game'
import startGame from '../server-actions/start-game'

export default function MultiplayerOptionsDialog() {
    const [isSearching, setIsSearching] = useState(false)

    // const [gameFound, setGameFound] = useState(false)
    const dispatch = useAppDispatch()
    const { timer } = useAppSelector(selectMultiplayerOptions)


    async function handelSearch() {
        // ideas : 
            // check if there is a not-started game in db 
                // if exist update it to 'playing' and redirect to /multiplayer
                // else create a new game with 'not-started' and wait for someone else to update it

        const startedGame = await startGame({
            playerId : 'temp' // get it from usePlayer
        })

        if (!startedGame) {
            const createdGame = await createGame({
                playerId : 'temp',
                timer  ,
                isForGuests : false // get it from usePlayer
            })
            // ...
        }
        setIsSearching(true)
        await delay(3000).then(() => {
            dispatch(replay())
            setIsSearching(false)
        })
    }

    return (
        <Dialog>
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
                    <Button disabled={isSearching} className="" onClick={handelSearch}>
                        Start
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
