'use client'
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { redo, replay, resign, selectIsGameOver, selectisUndoRedoable, undo } from "@/redux/slices/game-slice";

export default function GameDetails() {
    const dispatch = useAppDispatch()
    const isGameOver = useAppSelector(selectIsGameOver)
    const { isUndoable, isRedoable } = useAppSelector(selectisUndoRedoable)

    return (
        <div className="bg-gray-300 flex gap-2 flex-wrap landscape:min-w-[20%] landscape:lg:w-[30%] landscape:xl:w-[30%]  portrait:h-full  border-l-1 border-black/30 py-4 px-3">
            <Button disabled={isGameOver} className="cursor-pointer" onClick={()=>dispatch(resign())}>Resign</Button>
            <Button className="cursor-pointer" onClick={()=>dispatch(replay())}>Replay</Button>
            <Button disabled={!isUndoable} className="cursor-pointer" onClick={()=>dispatch(undo())}>Undo</Button>
            <Button disabled={!isRedoable} className="cursor-pointer" onClick={()=>dispatch(redo())}>Redo</Button>
        </div>
    )
}
