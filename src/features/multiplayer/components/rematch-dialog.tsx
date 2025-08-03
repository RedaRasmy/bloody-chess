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

export default function RematchDialog({
    defaultOpen = false,
    isOpen = true ,
    onAccept,
    onReject
}:{
    defaultOpen?: boolean
    isOpen?: boolean
    onAccept : () => void
    onReject : () => void
}) {

    if (isOpen) return (
        <Dialog defaultOpen={defaultOpen} onOpenChange={(open)=>{
            // reject on close
            if (!open) {
                onReject()
            }
        }}>
            <DialogContent className="">
                <DialogHeader>
                    <DialogTitle>
                        Your opponent wants a rematch!
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div>
                    <Button
                        onClick={onAccept}
                    >
                        Rematch
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
