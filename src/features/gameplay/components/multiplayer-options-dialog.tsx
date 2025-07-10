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
import { Link } from "@/i18n/navigation"
import SelectTimer from "./select-timer"
import { TIMER_OPTIONS } from "../utils/constantes"
import { replay } from "@/redux/slices/game-slice"

export default function MultiplayerOptionsDialog() {
    const dispatch = useAppDispatch()
    const { timer } = useAppSelector(selectMultiplayerOptions)

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
                        options={TIMER_OPTIONS}
                        value={timer}
                        onChange={(op) => dispatch(changeTimer(op))}
                    />
                </div>
                <DialogFooter>
                    <Button asChild className="">
                        <Link
                            href={"/play/multiplayer"}
                            onClick={() => dispatch(replay())}
                        >
                            Start
                        </Link>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}