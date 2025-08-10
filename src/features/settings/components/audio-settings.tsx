import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
// import { Slider } from "@/components/ui/slider"
import useAudioSettings from "../hooks/use-audio-settings"
import { Volume2, VolumeX } from "lucide-react"
import { Separator } from "@/components/ui/separator"


export default function AudioSettings() {
    const { audio, toggleSound } = useAudioSettings()
    return (
        <Card className="glass">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {audio.enabled ? (
                        <Volume2 className="w-5 h-5 text-primary" />
                    ) : (
                        <VolumeX className="w-5 h-5 text-primary" />
                    )}
                    Audio Settings
                </CardTitle>
                <CardDescription>
                    Configure sound effects and music
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Master Volume */}
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <label className="text-sm font-medium">
                            Enable Sound
                        </label>
                        <p className="text-xs text-muted-foreground">
                            Turn on/off all audio
                        </p>
                    </div>
                    <Switch
                        checked={audio.enabled}
                        onCheckedChange={() => toggleSound("enabled")}
                    />
                </div>

                {audio.enabled && (
                    <>
                        <Separator />

                        {/* Volume Control */}
                        {/* <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Master Volume</label>
                      <span className="text-sm text-muted-foreground">{volume[0]}%</span>
                    </div>
                    <Slider
                      value={volume}
                      onValueChange={setVolume}
                      max={100}
                      min={0}
                      step={5}
                      className="w-full"
                    />
                  </div> */}

                        {/* Move Sounds */}
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <label className="text-sm font-medium">
                                    Move Sounds
                                </label>
                                <p className="text-xs text-muted-foreground">
                                    Play sound when moves are made
                                </p>
                            </div>
                            <Switch
                                checked={audio.moves}
                                onCheckedChange={() => toggleSound("moves")}
                            />
                        </div>

                        {/* Game Start/End Sounds */}
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <label className="text-sm font-medium">
                                    Game Start Alert
                                </label>
                                <p className="text-xs text-muted-foreground">
                                    Play sound when game starts
                                </p>
                            </div>
                            <Switch
                                checked={audio.gameStart}
                                onCheckedChange={() => toggleSound("gameStart")}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <label className="text-sm font-medium">
                                    Game End Alert
                                </label>
                                <p className="text-xs text-muted-foreground">
                                    Play sound when game ends
                                </p>
                            </div>
                            <Switch
                                checked={audio.gameEnd}
                                onCheckedChange={() => toggleSound("gameEnd")}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <label className="text-sm font-medium">
                                    Clock Alert
                                </label>
                                <p className="text-xs text-muted-foreground">
                                    Play sound before time out
                                </p>
                            </div>
                            <Switch
                                checked={audio.timeout}
                                onCheckedChange={() => toggleSound("timeout")}
                            />
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}
