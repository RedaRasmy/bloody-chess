"use client"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { replay, selectGameOverData } from "@/redux/slices/game-slice"
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
    const dispatch = useAppDispatch()


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
                    <Button className="cursor-pointer" onClick={()=>dispatch(replay())}>Replay</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
