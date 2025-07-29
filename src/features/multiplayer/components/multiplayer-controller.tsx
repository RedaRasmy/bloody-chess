'use client'
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {  selectIsGameOver } from "@/redux/slices/game/game-selectors";
import {  resign } from "@/redux/slices/game/game-slice";

export default function MultiplayerController({
    onResign,
    // onReplayOffer,
    // onDrawOffer
}:{
    onResign?: () => Promise<void>
    // onReplayOffer?: () => Promise<void>
    // // onDrawOffer?: () => Promise<void>
}) {
    const dispatch = useAppDispatch()
    const isGameOver = useAppSelector(selectIsGameOver)
    // const { isUndoable, isRedoable } = useAppSelector(selectIsUndoRedoable)

    async function handleResign() {
        dispatch(resign())
        await onResign?.()
    }
    
    // async function handleRepaly() {
    //     dispatch(resign())
    //     await onResign?.()
    // }
    // async function handleDrawOffer() {
    //     dispatch(resign())
    //     await onResign?.()
    // }


    return (
        <div className="bg-gray-300 flex gap-2 flex-wrap landscape:min-w-[20%] landscape:lg:w-[30%] landscape:xl:w-[30%]  portrait:h-full  border-l-1 border-black/30 py-4 px-3">
            <Button disabled={isGameOver} className="cursor-pointer" onClick={handleResign}>Resign</Button>
            {/* <Button className="cursor-pointer" onClick={()=>dispatch(play())}>Replay</Button> */}
            {/* <Button disabled={!isUndoable} className="cursor-pointer" onClick={()=>dispatch(undo())}>Undo</Button>
            <Button disabled={!isRedoable} className="cursor-pointer" onClick={()=>dispatch(redo())}>Redo</Button> */}
        </div>
    )
}
