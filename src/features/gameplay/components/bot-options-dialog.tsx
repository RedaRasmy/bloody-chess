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
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import {
    changeColor,
    changeLevel,
    changeTimer,
    selectBotOptions,
} from "@/redux/slices/game-options"
import { Link } from "@/i18n/navigation"
import SelectTimer from "./select-timer"
import { TIMER_OPTIONS } from "../utils/constantes"
import { replay } from "@/redux/slices/game/game-slice"
import {ColorOption} from '../types'

export default function BotOptionsDialog() {
    const dispatch = useAppDispatch()
    const { level, timer, color } = useAppSelector(selectBotOptions)

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
                            onValueChange={(e) => dispatch(changeLevel(e[0]))}
                            value={[level]}
                        />
                    </div>
                    <div className="flex  gap-4">
                        <p className="text-nowrap">Color : </p>
                        <RadioGroup
                            defaultValue={color}
                            onValueChange={e=>dispatch(changeColor(e as ColorOption))}
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
                        options={[...TIMER_OPTIONS]}
                        value={timer}
                        onChange={(op) => dispatch(changeTimer(op))}
                    />
                </div>
                <DialogFooter>
                    <Button asChild className="">
                        <Link
                            href={"/play/bot"}
                            onClick={() => dispatch(replay())}
                        >
                            Start
                        </Link>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
