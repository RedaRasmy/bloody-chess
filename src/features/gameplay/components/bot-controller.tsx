"use client"
import { Button } from "@/components/ui/button"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { selectBotOptions } from "@/redux/slices/game-options"
import { selectIsGameOver } from "@/redux/slices/game/game-selectors"
import { play, resign } from "@/redux/slices/game/game-slice"

export default function BotController() {
    const dispatch = useAppDispatch()
    const isGameOver = useAppSelector(selectIsGameOver)
    const { level } = useAppSelector(selectBotOptions)

    // const { isUndoable, isRedoable } = useAppSelector(selectIsUndoRedoable)

    function handleResign() {
        dispatch(resign())
    }

    function handleReplay() {
        dispatch(
            play({
                playerName: "player",
                opponentName: `bot - lvl ${level}`,
            })
        )
    }

    return (
        <div className="bg-gray-300 flex gap-2 flex-wrap landscape:min-w-[20%] landscape:lg:w-[30%] landscape:xl:w-[30%]  portrait:h-full  border-l-1 border-black/30 py-4 px-3">
            <Button
                disabled={isGameOver}
                className="cursor-pointer"
                onClick={handleResign}
            >
                Resign
            </Button>
            <Button className="cursor-pointer" onClick={handleReplay}>
                Replay
            </Button>
            {/* <Button disabled={!isUndoable} className="cursor-pointer" onClick={()=>dispatch(undo())}>Undo</Button>
            <Button disabled={!isRedoable} className="cursor-pointer" onClick={()=>dispatch(redo())}>Redo</Button> */}
        </div>
    )
}
