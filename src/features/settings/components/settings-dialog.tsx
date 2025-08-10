"use client"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import useSettings from "../hooks/use-settings"
import { Slider } from "@/components/ui/slider"

export default function SettingsDialog() {
    const {
        resetDefaults,
        audio : {
            moves,
            gameStart,
            gameEnd,
            timeout
        },
        movesAnimationEnabled,
        movesAnimationDuration,
        toggleSound,
        toggleMovesAnimation,
        changeMovesDuration,
    } = useSettings()

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className=" py-6 cursor-pointer w-full">
                    Settings
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] ">
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-2">
                    <h1 className="text-lg font-semibold mb-1">Animations</h1>
                    <div className="pl-2 flex flex-col gap-4 mb-2">
                        <div className="flex gap-2">
                            <Checkbox
                                id="moves-animation"
                                checked={movesAnimationEnabled}
                                onCheckedChange={toggleMovesAnimation}
                            />
                            <Label htmlFor="moves-animation">
                                Moves Animation
                            </Label>
                        </div>
                        <div className="flex gap-2 ">
                            <Label
                                htmlFor="moves-duration"
                                className="text-nowrap"
                            >
                                Move Duration (ms){" "}
                                <span className="font-bold">
                                    {movesAnimationDuration}
                                </span>
                            </Label>
                            <Slider
                                disabled={!movesAnimationEnabled}
                                id="moves-duration"
                                value={[movesAnimationDuration]}
                                min={20}
                                max={500}
                                step={1}
                                onValueChange={([duration]) =>
                                    changeMovesDuration(duration)
                                }
                            />
                        </div>
                    </div>
                    <h1 className="text-lg font-semibold mb-1">Sounds</h1>
                    <div className="flex gap-2 pl-2">
                        <Checkbox
                            id="moves-sound"
                            checked={moves}
                            onCheckedChange={()=>toggleSound("moves")}
                        />
                        <Label htmlFor="moves-sound">Moves Sound</Label>
                    </div>
                    <div className="flex gap-2 pl-2">
                        <Checkbox
                            id="game-start"
                            checked={gameStart}
                            onCheckedChange={()=>toggleSound('gameStart')}
                        />
                        <Label htmlFor="game-start">Game start alert</Label>
                    </div>
                    <div className="flex gap-2 pl-2">
                        <Checkbox
                            id="game-end"
                            checked={gameEnd}
                            onCheckedChange={()=>toggleSound('gameEnd')}
                        />
                        <Label htmlFor="game-end">Game end alert</Label>
                    </div>
                    <div className="flex gap-2 pl-2">
                        <Checkbox
                            id="timer-alert"
                            checked={timeout}
                            onCheckedChange={()=>toggleSound('timeout')}
                        />
                        <Label htmlFor="timer-alert">Timer alert</Label>
                    </div>
                </div>
                <DialogFooter>
                    <Button asChild className="">
                        <Button onClick={resetDefaults}>Reset Defaults</Button>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
