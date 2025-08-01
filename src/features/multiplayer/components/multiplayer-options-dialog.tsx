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
    changeMultiplayerTimer,
    selectMultiplayerOptions,
} from "@/redux/slices/game-options"
import SelectTimer from "../../gameplay/components/select-timer"
import { useRouter } from "next/navigation"
import useGameSearching from "../hooks/use-game-searching"
import { useEffect } from "react"

export default function MultiplayerOptionsDialog({
    defaultOpen = false,
}: {
    defaultOpen?: boolean
}) {
    const MULTIPLAYER_PATH = "play/multiplayer/"
    const router = useRouter()
    const { timer } = useAppSelector(selectMultiplayerOptions)
    const dispatch = useAppDispatch()

    const { searchTimer, isSearching, startSearch, cancelSearch } =
        useGameSearching({
            timerOption: timer,
            onGameFound: async (game, {}) => {
                router.push(MULTIPLAYER_PATH + game.id)
            },
        })

    useEffect(() => {
        if (defaultOpen) {
            startSearch()
        }
    }, [])

    return (
        <Dialog onOpenChange={cancelSearch} defaultOpen={defaultOpen}>
            <DialogTrigger asChild>
                <Button className="py-6 cursor-pointer w-full">
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
                        value={timer}
                        onChange={(op) => dispatch(changeMultiplayerTimer(op))}
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
