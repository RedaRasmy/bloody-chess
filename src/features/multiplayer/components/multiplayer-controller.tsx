'use client'
import { Button } from "@/components/ui/button";
import HistoryController from "@/features/gameplay/components/history-controller";
import useHistoryController from "@/features/gameplay/hooks/use-history-controller";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {  selectIsGameOver } from "@/redux/slices/game/game-selectors";
import {  resign } from "@/redux/slices/game/game-slice";
import { Flag, Handshake, Plus, RotateCcw } from "lucide-react";

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

    const {undo, redo, undoToStart, redoToEnd} = useHistoryController()
    
    // async function handleRepaly() {
    //     dispatch(resign())
    //     await onResign?.()
    // }
    // async function handleDrawOffer() {
    //     dispatch(resign())
    //     await onResign?.()
    // }

    return (
        <div className="bg-gray-300 py-3 lg:py-5 flex flex-col gap-5 lg:gap-8 justify-center items-center landscape:min-w-[20%] landscape:lg:w-[30%] landscape:xl:w-[30%]  portrait:h-full  border-l-1 border-black/30 ">
            <div className="grid grid-cols-2 px-2 lg:px-4 w-full gap-2 grid-rows-2 ">
                <Button
                    disabled={isGameOver}
                    className="cursor-pointer w-full font-semibold"
                    onClick={handleResign}
                    variant={"outline"}
                >
                    <Flag />
                    Resign
                </Button>
                <Button
                    className="cursor-pointer w-full font-semibold"
                    variant={"outline"}
                    disabled
                >
                    <RotateCcw />
                    Replay
                </Button>
                <Button
                    className="cursor-pointer w-full font-semibold"
                    variant={"outline"}
                    disabled
                >
                    <Handshake />
                    Draw
                </Button>
                <Button
                    className="cursor-pointer w-full font-semibold"
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
