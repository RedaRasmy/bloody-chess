
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import BotOptionsDialog from "@/features/gameplay/components/bot-options-dialog"


export default function Home() {

    return (
        <div className="flex h-full justify-center items-center bg-gray-200">
            <div className="flex flex-col gap-2">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="lg:w-sm w-50 py-6 cursor-pointer">
                            Play Online
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Multiplayer game setup</DialogTitle>
                        </DialogHeader>
                        <div className="">coming soon</div>
                        <DialogFooter>
                            <Button type="submit">Start</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <BotOptionsDialog/>
            </div>
        </div>
    )
}
