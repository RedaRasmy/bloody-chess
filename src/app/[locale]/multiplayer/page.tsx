"use client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Timer, Users } from "lucide-react"
import SelectTimer from "@/features/gameplay/components/select-timer"
import { useRouter, useSearchParams } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import {
    changeMultiplayerTimer,
    selectMultiplayerOptions,
} from "@/redux/slices/game-options"
import useGameSearching from "@/features/multiplayer/hooks/use-game-searching"
import { useEffect } from "react"

export default function MultiplayerOptions() {
    const MULTIPLAYER_PATH = "play/multiplayer/"
    const router = useRouter()
    const params = useSearchParams()
    const isAutoSearch = params.get("auto-search") === "true"
    const { timer } = useAppSelector(selectMultiplayerOptions)
    const dispatch = useAppDispatch()

    const { searchTimer, isSearching, startSearch, cancelSearch } =
        useGameSearching({
            timerOption: timer,
            onGameFound: async (game, {}) => {
                router.push(MULTIPLAYER_PATH + game.id)
            },
        })

    useEffect(() => {
        if (isAutoSearch) {
            startSearch()
        }
    }, [])

    return (
        <div className="space-y-5 flex flex-col w-full">
            <div className="flex items-center gap-2 flex-col">
                <h1 className="text-3xl font-bold">Multiplayer Chess</h1>
                <p className="text-muted-foreground">
                    Challenge players around the world
                </p>
            </div>

            <Card className="lg:mx-2 xl:mx-5 not-md:-space-y-2">
                <CardHeader>
                    <div>
                        <h1 className="text-2xl font-semibold flex gap-3 items-center">
                            <Users />
                            Game Setup
                        </h1>
                        <p className="text-muted-foreground">
                            Configure your multiplayer game
                        </p>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-5 lg:gap-7 w-full">
                        <div className="flex flex-col lg:items-center justify-center w-full ">
                            <h1 className="text-xl font-semibold mb-4 lg:mb-6 flex gap-2 ">
                                <Timer />
                                Time Control
                            </h1>
                            <div className="flex items-center justify-center w-full flex-col">
                                <SelectTimer
                                    className=""
                                    value={timer}
                                    onChange={(op) =>
                                        dispatch(changeMultiplayerTimer(op))
                                    }
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex flex-col lg:flex-row-reverse gap-2">
                            {isSearching && (
                                <Button
                                    variant={"outline"}
                                    onClick={cancelSearch}
                                    className="w-full lg:max-w-xs py-5 cursor-pointer"
                                >
                                    Cancel
                                </Button>
                            )}
                            <Button
                                disabled={isSearching}
                                className="w-full lg:max-w-xs py-5 cursor-pointer"
                                onClick={startSearch}
                                variant={"outline"}
                            >
                                {isSearching
                                    ? `Searching... [ ${searchTimer} ]`
                                    : "Start"}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
