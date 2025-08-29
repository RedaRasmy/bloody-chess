'use client'
import { Button } from "@/components/ui/button";
import HistoryController from "@/features/gameplay/components/history-controller";
import useHistoryController from "@/features/gameplay/hooks/use-history-controller";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {  selectIsGameOver } from "@/redux/slices/game/game-selectors";
import {  resign } from "@/redux/slices/game/game-slice";
import { Flag, Handshake, Plus, RotateCcw } from "lucide-react";
import Link from "next/link";

export default function MultiplayerController({
    onResign,
    onRematchOffer,
    onDrawOffer
}:{
    onResign?: () => Promise<void>
    onRematchOffer?: () => Promise<void>
    onDrawOffer?: () => Promise<void>
}) {
    const dispatch = useAppDispatch()
    const isGameOver = useAppSelector(selectIsGameOver)

    async function handleResign() {
        dispatch(resign())
        await onResign?.()
    }

    const {undo, redo, undoToStart, redoToEnd} = useHistoryController()
    
    async function handleRematch() {
        await onRematchOffer?.()
    }

    async function handleDrawOffer() {
        console.log('click offer draw')
        await onDrawOffer?.()
    }

    return (
        <div className="bg-secondary py-3 lg:py-5 flex flex-col gap-5 lg:gap-8 justify-center items-center landscape:min-w-[20%] landscape:lg:w-[30%] landscape:xl:w-[30%]  portrait:h-full  border-l-1 border-black/30 ">
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
                    onClick={handleRematch}
                    disabled={!isGameOver}
                >
                    <RotateCcw />
                    Rematch
                </Button>
                <Button
                    className="cursor-pointer w-full font-semibold"
                    variant={"outline"}
                    onClick={handleDrawOffer}
                    disabled={isGameOver}
                >
                    <Handshake />
                    Draw
                </Button>
                <Button
                    className="cursor-pointer w-full font-semibold"
                    variant={"outline"}
                    asChild
                    disabled={!isGameOver}
                >
                    <Link href="/multiplayer?matching=true">
                        <Plus />
                        New Game
                    </Link>
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
