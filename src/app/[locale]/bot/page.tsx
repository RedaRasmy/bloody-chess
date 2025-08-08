"use client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bot, Timer } from "lucide-react"
import SelectTimer from "@/features/gameplay/components/select-timer"
import useBotController from "@/features/bot/hooks/use-bot-controller"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import SelectColor from "@/features/gameplay/components/select-color"

export default function Multiplayer() {
    // const dispatch = useAppDispatch()

    const {
        start,
        setOptions,
        options: { timer, level, color },
    } = useBotController()

    return (
        <div className="space-y-5 flex flex-col w-full">
            <div className="flex items-center gap-2 flex-col">
                <h1 className="text-3xl font-bold">Play vs Bot</h1>
                <p className="text-muted-foreground">
                    Practice against our intelligent AI opponents
                </p>
            </div>

            <Card className="">
                <CardHeader>
                    <div>
                        <h1 className="text-2xl font-semibold flex gap-3 items-center">
                            <Bot />
                            Bot Configuration
                        </h1>
                        <p className="text-muted-foreground">
                            Customize your AI opponent
                        </p>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col  gap-5 lg:gap-7 w-full">
                        <div className="flex flex-col lg:justify-around gap-5 lg:gap-7 xl:flex-row">
                            <div className="flex flex-col gap-5 lg:gap-7 w-full ">
                                <div className="flex flex-col lg:items-center justify-center w-full max-w-[min(100%,400px)]">
                                    <h1 className="text-xl text-nowrap items-center justify-between font-semibold mb-4 flex gap-2 w-full ">
                                        Difficulty Level
                                        <Badge className="h-4 w-20 rounded-lg">
                                            Level {level}
                                        </Badge>
                                    </h1>
                                    <Slider
                                        max={20}
                                        step={1}
                                        onValueChange={(e) =>
                                            setOptions({ level: e[0] })
                                        }
                                        value={[level]}
                                    />
                                </div>
                                <div>
                                    <h1 className="text-xl text-nowrap items-center justify-between font-semibold mb-4 flex gap-2 w-full ">
                                        Your Color
                                    </h1>
                                    <SelectColor
                                        onChange={(color)=>setOptions({playerColor:color})}
                                        value={color}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col lg:items-center justify-center w-full ">
                                <h1 className="text-xl items-center font-semibold mb-4 lg:mb-6 flex gap-2 ">
                                    <Timer />
                                    Time Control
                                    <span className="text-xs text-muted-foreground">(optional)</span>
                                </h1>
                                <div className="flex items-center justify-center w-full flex-col">
                                    <SelectTimer
                                        className=""
                                        value={timer}
                                        onChange={(op) =>
                                            setOptions({ timer: op })
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col lg:flex-row-reverse gap-2">
                            <Button
                                className="w-full lg:max-w-xs py-5 cursor-pointer"
                                onClick={start}
                                variant={"outline"}
                            >
                                Start
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
