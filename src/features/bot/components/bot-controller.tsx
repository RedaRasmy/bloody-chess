"use client"
import { Button } from "@/components/ui/button"
import { useAppSelector } from "@/redux/hooks"
import { selectIsGameOver } from "@/redux/slices/game/game-selectors"
import useBotController from "../hooks/use-bot-controller"

export default function BotController() {
    const isGameOver = useAppSelector(selectIsGameOver)

    const {start,resign} = useBotController()

    // const { isUndoable, isRedoable } = useAppSelector(selectIsUndoRedoable)


    return (
        <div className="bg-gray-300 flex gap-2 flex-wrap landscape:min-w-[20%] landscape:lg:w-[30%] landscape:xl:w-[30%]  portrait:h-full  border-l-1 border-black/30 py-4 px-3">
            <Button
                disabled={isGameOver}
                className="cursor-pointer"
                onClick={resign}
            >
                Resign
            </Button>
            <Button className="cursor-pointer" onClick={start}>
                Replay
            </Button>
            {/* <Button disabled={!isUndoable} className="cursor-pointer" onClick={()=>dispatch(undo())}>Undo</Button>
            <Button disabled={!isRedoable} className="cursor-pointer" onClick={()=>dispatch(redo())}>Redo</Button> */}
        </div>
    )
}
