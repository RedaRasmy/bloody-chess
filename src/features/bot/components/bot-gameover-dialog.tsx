"use client"
import { useAppSelector } from "@/redux/hooks"
import { selectGameOverData } from "@/redux/slices/game/game-selectors"
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
import useBotController from "../hooks/use-bot-controller"

export default function BotGameOverDialog() {
    const { isWin, isDraw, reason, isGameOver } =
        useAppSelector(selectGameOverData)

    const { start } = useBotController()

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
                        <Button className="cursor-pointer" onClick={start}>
                            Replay
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )
}
