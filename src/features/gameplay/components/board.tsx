"use client"
import Square from "./square"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import {
    move,
    selectAllowedSquares,
    selectBoard,
    selectFEN,
    selectIsPlayerTurn,
    selectPlayerColor,
} from "@/redux/slices/game-slice"
import { indexToSquare } from "../utils/index-to-square"
import { cn } from "@/lib/utils"
import { useEffect } from "react"
import { getEngineResponse } from "../server-actions/chess-engine"
import { selectBotOptions } from "@/redux/slices/game-options"
import { Chess, Square as SquareType } from "chess.js"
import playSound from "../utils/play-sound"

export default function Board() {
    const board = useAppSelector(selectBoard).flat()
    const allowedSquares = useAppSelector(selectAllowedSquares)
    const playerColor = useAppSelector(selectPlayerColor)
    const isPlayerTurn = useAppSelector(selectIsPlayerTurn)
    const fen = useAppSelector(selectFEN)
    const { level } = useAppSelector(selectBotOptions)
    const dispatch = useAppDispatch()
    const chess = new Chess(fen)

    useEffect(() => {
        if (!isPlayerTurn) {
            // after player moves, it’s opponent's turn
            async function fetchBestMove() {
                const res = await getEngineResponse(fen, level)
                if (res.success) {
                    const bestMove = res.bestmove.split(" ")[1]
                    const from = bestMove.slice(0, 2) as SquareType
                    const to = bestMove.slice(2) as SquareType
                    dispatch(move({ from, to }))
                    const theMove = chess.move({ from, to })
                    if (theMove.isCapture()) {
                        playSound("capture")
                    } else {
                        playSound("move")
                    }
                }
            }
            fetchBestMove()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPlayerTurn])

    return (
        <div className="lg:w-130 w-90 md:portrait:w-140 not-sm:m-5 relative after:[content:''] after:block after:pt-[100%] ">
            <div
                className={cn(
                    "absolute w-full h-full bg-black grid grid-cols-8 grid-rows-8",
                    {
                        "rotate-180": playerColor === "b",
                    }
                )}
            >
                {board.map((p, i) => {
                    const squareColor = getSquareColor(i)
                    return (
                        <Square
                            name={indexToSquare(i)}
                            color={squareColor}
                            piece={p}
                            key={i}
                            isToMove={allowedSquares.includes(indexToSquare(i))}
                        />
                    )
                })}
            </div>
        </div>
    )
}

function getSquareColor(index: number): "w" | "b" {
    const row = Math.floor(index / 8)
    const col = index % 8

    return (row + col) % 2 === 0 ? "w" : "b"
}
