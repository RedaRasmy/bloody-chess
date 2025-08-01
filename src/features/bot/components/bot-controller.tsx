"use client"
import { Button } from "@/components/ui/button"
import { useAppSelector } from "@/redux/hooks"
import { selectIsGameOver } from "@/redux/slices/game/game-selectors"
import useBotController from "../hooks/use-bot-controller"
import HistoryController from "@/features/gameplay/components/history-controller"
import { Flag, RotateCcw, Plus, Undo } from "lucide-react"
import useHistoryController from "@/features/gameplay/hooks/use-history-controller"

export default function BotController() {
    const isGameOver = useAppSelector(selectIsGameOver)

    const { start, resign } =
        useBotController()

    const {undo, redo, undoToStart, redoToEnd} = useHistoryController()
    
    return (
        <div className="bg-gray-300 py-3 lg:py-5 flex flex-col gap-5 lg:gap-8 justify-center items-center landscape:min-w-[20%] landscape:lg:w-[30%] landscape:xl:w-[30%]  portrait:h-full  border-l-1 border-black/30 ">
            <div className="grid grid-cols-2 px-2 lg:px-4 w-full gap-2 grid-rows-2 ">
                <Button
                    disabled={isGameOver}
                    className="cursor-pointer w-full font-semibold"
                    onClick={resign}
                    variant={"outline"}
                >
                    <Flag />
                    Resign
                </Button>
                <Button
                    className="cursor-pointer w-full font-semibold"
                    onClick={start}
                    variant={"outline"}
                >
                    <RotateCcw />
                    Replay
                </Button>
                <Button
                    className="cursor-pointer w-full font-semibold"
                    // onClick={start}
                    variant={"outline"}
                    disabled
                >
                    <Undo />
                    Undo
                </Button>
                <Button
                    className="cursor-pointer w-full font-semibold"
                    // onClick={start}
                    variant={"outline"}
                    disabled
                >
                    <Plus />
                    New Game
                </Button>
            </div>
            <HistoryController
                onUndo={undo}
                onRedo={redo}
                onStart={undoToStart}
                onEnd={redoToEnd}
            />
        </div>
    )
}
