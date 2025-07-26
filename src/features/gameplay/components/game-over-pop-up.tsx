"use client"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { selectGameOverData } from "@/redux/slices/game/game-selectors"
import { play } from "@/redux/slices/game/game-slice"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { selectBotOptions } from "@/redux/slices/game-options"

export default function GameOverPopUp() {
    const { isWin, isDraw, reason, isGameOver } =
        useAppSelector(selectGameOverData)
    const { level } = useAppSelector(selectBotOptions)
    const dispatch = useAppDispatch()

    function handleReplay() {
        dispatch(
            play({
                playerName: "player",
                opponentName: `bot - lvl ${level}`,
            })
        )
    }

    if (isGameOver)
        return (
            <Dialog defaultOpen>
                <DialogContent className="">
                    <DialogHeader>
                        <DialogTitle>
                            {isDraw
                                ? "You Draw"
                                : isWin
                                ? "You Won"
                                : "You Lost"}
                        </DialogTitle>
                        <DialogDescription>By {reason}</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button asChild variant="outline">
                            <Link href={"/"}>Home</Link>
                        </Button>
                        <Button
                            className="cursor-pointer"
                            onClick={handleReplay}
                        >
                            Replay
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )
}
