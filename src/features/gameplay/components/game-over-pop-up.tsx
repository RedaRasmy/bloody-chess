"use client"
import { useAppSelector } from "@/redux/hooks"
import { selectGameOverData } from "@/redux/slices/game-slice"
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

export default function GameOverPopUp() {
    const { isWin, isDraw, cause ,isGameOver } = useAppSelector(selectGameOverData)

    console.log(isGameOver)

    if (isGameOver) return (
        <Dialog defaultOpen >
            <DialogContent className="">
                <DialogHeader>
                    <DialogTitle>
                        {isWin ? "You won" : "You lost"}
                        {isDraw && "Draw"}
                    </DialogTitle>
                    <DialogDescription>By {cause}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button asChild variant="outline">
                        <Link href={'/'}>Home</Link>
                    </Button>
                    <Button >Replay</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
