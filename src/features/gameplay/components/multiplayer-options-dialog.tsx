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
import SelectTimer from "./select-timer"
import { TIMER_OPTIONS } from "../utils/constantes"
import { useRouter } from "next/navigation"
import useGameSearching from "../hooks/use-game-searching"

export default function MultiplayerOptionsDialog() {
    const MULTIPLAYER_PATH = "play/multiplayer/"
    const router = useRouter()
    const { timer } = useAppSelector(selectMultiplayerOptions)

    const { searchTimer, isSearching, startSearch, cancelSearch } =
        useGameSearching({
            timerOption: timer,
            onGameFound: (game) => {
                router.push(MULTIPLAYER_PATH + game.id)
            },
        })

    const dispatch = useAppDispatch()

    return (
        <Dialog onOpenChange={cancelSearch}>
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
                <DialogFooter>
                    {isSearching && (
                        <Button onClick={cancelSearch}>Cancel</Button>
                    )}
                    <Button
                        disabled={isSearching}
                        className=""
                        onClick={startSearch}
                    >
                        {isSearching
                            ? `Searching... [ ${searchTimer} ]`
                            : "Start"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
