"use client"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function DrawDialog({
    isOpen = true ,
    onAccept,
    onReject
}:{
    isOpen?: boolean
    onAccept : () => void
    onReject : () => void
}) {

    console.log('is draw offer dialog open : ' ,isOpen)

    if (isOpen) return (
        <Dialog defaultOpen onOpenChange={(open)=>{
            // reject on close
            if (!open) {
                onReject()
            }
        }}>
            <DialogContent className="">
                <DialogHeader>
                    <DialogTitle>
                        Your opponent offers a draw!
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="flex items-center justify-center w-full gap-2">
                    <Button
                        onClick={onAccept}
                    >
                        Draw
                    </Button>
                    <Button
                        onClick={onReject}
                    >
                        Reject
                    </Button>
                </div>
                <DialogFooter>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
