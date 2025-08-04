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

export default function MultiplayerGameOverDialog({
    onRematch,
}: {
    onRematch: () => Promise<void>
}) {
    const { isWin, isDraw, reason, isGameOver } =
        useAppSelector(selectGameOverData)

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
                        <Button onClick={onRematch} variant="outline">
                            Rematch
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )
}
