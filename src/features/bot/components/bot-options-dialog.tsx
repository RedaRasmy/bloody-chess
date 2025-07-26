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
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Link } from "@/i18n/navigation"
import SelectTimer from "../../gameplay/components/select-timer"
import { ColorOption } from "../../gameplay/types"
import useBotController from "../hooks/use-bot-controller"

export default function BotOptionsDialog() {

    const {options:{level,timer,color},start,setOptions} = useBotController()

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="lg:w-sm w-50 py-6 cursor-pointer">
                    Play Bot
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] ">
                <DialogHeader>
                    <DialogTitle>Bot game setup</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        <p className="text-nowrap">Level : {level}</p>
                        <Slider
                            max={20}
                            step={1}
                            onValueChange={(e) => setOptions({level:e[0]})}
                            value={[level]}
                        />
                    </div>
                    <div className="flex  gap-4">
                        <p className="text-nowrap">Color : </p>
                        <RadioGroup
                            defaultValue={color}
                            onValueChange={(e) =>
                                setOptions({playerColor: e as ColorOption})
                            }
                            className="flex flex-row"
                        >
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="white" id="r1" />
                                <Label htmlFor="r1">White</Label>
                            </div>
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="random" id="r2" />
                                <Label htmlFor="r2">Random</Label>
                            </div>
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="black" id="r3" />
                                <Label htmlFor="r3">Black</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <SelectTimer
                        value={timer}
                        onChange={(op) => setOptions({timer:op})}
                    />
                </div>
                <DialogFooter>
                    <Button asChild className="">
                        <Link
                            href={"/play/bot"}
                            onClick={start}
                        >
                            Start
                        </Link>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
