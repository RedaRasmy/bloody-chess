import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
} from "@/components/ui/card"
import { Monitor } from "lucide-react"
import useDisplaySettings from "../hooks/use-display-settings"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"

export default function DisplaySettings() {
    const {
        changeMovesDuration,
        movesAnimationDuration,
        movesAnimationEnabled,
        toggleMovesAnimation,
    } = useDisplaySettings()

    return (
        <Card className="glass">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Monitor className="w-5 h-5 text-primary" />
                    Display Settings
                </CardTitle>
                <CardDescription>
                    Customize the visual appearance
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Animations */}
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <label className="text-sm font-medium">
                            Smooth Animations
                        </label>
                        <p className="text-xs text-muted-foreground">
                            Enable piece movement animations
                        </p>
                    </div>
                    <Switch
                        checked={movesAnimationEnabled}
                        onCheckedChange={toggleMovesAnimation}
                    />
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">
                            Duration 
                        </label>
                        <span className="text-sm text-muted-foreground">
                            {movesAnimationDuration}ms
                        </span>
                    </div>
                    <Slider
                        value={[movesAnimationDuration]}
                        onValueChange={v=>changeMovesDuration(v[0])}
                        max={500}
                        min={20}
                        step={10}
                        className="w-full"
                        disabled={!movesAnimationEnabled}
                    />
                </div>

                {/* Board Coordinates */}
                {/* <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <label className="text-sm font-medium">
                            Show Coordinates
                        </label>
                        <p className="text-xs text-muted-foreground">
                            Display file and rank labels
                        </p>
                    </div>
                    <Switch defaultChecked />
                </div> */}

                {/* Last Move Highlight */}
                {/* <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <label className="text-sm font-medium">
                            Highlight Last Move
                        </label>
                        <p className="text-xs text-muted-foreground">
                            Show the previous move on board
                        </p>
                    </div>
                    <Switch defaultChecked />
                </div> */}

                {/* Check Highlight */}
                {/* <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <label className="text-sm font-medium">
                            Check Indicator
                        </label>
                        <p className="text-xs text-muted-foreground">
                            Highlight king when in check
                        </p>
                    </div>
                    <Switch defaultChecked />
                </div> */}
            </CardContent>
        </Card>
    )
}
