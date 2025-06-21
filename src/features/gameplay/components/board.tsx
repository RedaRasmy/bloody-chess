"use client"
import Square from "./square"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import {
    move,
    selectAllowedSquares,
    selectBoard,
    selectFEN,
    selectIsPlayerTurn,
    selectLastMove,
    selectPlayerColor,
} from "@/redux/slices/game-slice"
import { indexToSquare } from "../utils/index-to-square"
import { cn } from "@/lib/utils"
import { useEffect } from "react"
import { getEngineResponse } from "../server-actions/chess-engine"
import { selectBotOptions } from "@/redux/slices/game-options"
import { Chess, Square as SquareType } from "chess.js"
import { playMoveSound } from "../utils/play-move-sound"

export default function Board() {
    const board = useAppSelector(selectBoard).flat()
    const allowedSquares = useAppSelector(selectAllowedSquares)
    const playerColor = useAppSelector(selectPlayerColor)
    const isPlayerTurn = useAppSelector(selectIsPlayerTurn)
    const fen = useAppSelector(selectFEN)
    const { level } = useAppSelector(selectBotOptions)
    const dispatch = useAppDispatch()
    const chess = new Chess(fen)
    const lastMove = useAppSelector(selectLastMove)

    useEffect(() => {
        if (!isPlayerTurn) {
            // after player moves, it’s opponent's turn
            async function fetchBestMove() {
                const res = await getEngineResponse(fen, level)
                if (res.success) {
                    const bestMove = res.bestmove.split(" ")[1]
                    const from = bestMove.slice(0, 2) as SquareType
                    const to = bestMove.slice(2,4) as SquareType
                    const promotion = bestMove.length === 5 ? bestMove.slice(5) : undefined
                    dispatch(move({ from, to , promotion}))
                    const theMove = chess.move({ from, to , promotion })
                    playMoveSound(theMove, chess.inCheck())
                }
            }
            fetchBestMove()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPlayerTurn])

    return (
        <div className="flex flex-col w-full h-full gap-2 items-center justify-center">
            <div className="flex flex-col w-full max-w-[80vh] gap-2">
                <div className="border-1 border-black  bg-amber-200 h-fit w-full"> 
                </div>
                    <div
                        className={cn(
                            "aspect-square w-full bg-black grid grid-cols-8 grid-rows-8",
                            {
                                "rotate-180": playerColor === "b",
                            }
                        )}
                    >
                        {board.map((p, i) => {
                            const squareColor = getSquareColor(i)
                            const name = indexToSquare(i)
                            return (
                                <Square
                                    name={name}
                                    color={squareColor}
                                    piece={p}
                                    key={i}
                                    isToMove={allowedSquares.includes(name)}
                                    isLastMove={
                                        !!lastMove &&
                                        (lastMove.from == name || lastMove.to == name)
                                    }
                                />
                            )
                        })}
                    </div>
                <div className="border-1 border-black  bg-amber-200 h-fit w-full">
                </div>
            </div>
        </div>
    )
}

function getSquareColor(index: number): "w" | "b" {
    const row = Math.floor(index / 8)
    const col = index % 8

    return (row + col) % 2 === 0 ? "w" : "b"
}
