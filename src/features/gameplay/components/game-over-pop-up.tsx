"use client"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { selectGameOverData } from "@/redux/slices/game/game-selectors"
import { replay } from "@/redux/slices/game/game-slice"
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
    const { isWin, isDraw, reason ,isGameOver } = useAppSelector(selectGameOverData)
    const dispatch = useAppDispatch()


    if (isGameOver) return (
        <Dialog defaultOpen >
            <DialogContent className="">
                <DialogHeader>
                    <DialogTitle>
                        {isDraw ? "You Draw" : isWin ? 'You Won' : 'You Lost'}
                    </DialogTitle>
                    <DialogDescription>By {reason}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button asChild variant="outline">
                        <Link href={'/'}>Home</Link>
                    </Button>
                    <Button className="cursor-pointer" onClick={()=>dispatch(replay())}>Replay</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
