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

export default function SettingsDialog() {


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className=" py-6 cursor-pointer w-full" >
                    Settings
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] ">
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                   
                </div>
                <DialogFooter>
                    {/* <Button asChild className="">
                        <Link href={"/play/bot"} onClick={start}>
                            Start
                        </Link>
                    </Button> */}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
