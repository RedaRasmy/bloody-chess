import { cn } from "@/lib/utils"
import { type Color, type Square } from "chess.js"
import React, { useEffect } from "react"
import { getPieceName } from "../utils/getPieceName"
import Image from "next/image"
import { BoardElement } from "../types"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import {
    move,
    opponentMove,
    selectFEN,
    selectIsPlayerTurn,
    selectPlayerColor,
    toMove,
} from "@/redux/slices/game-slice"
import { getEngineResponse } from "../server-actions/chess-engine"
import { selectBotOptions } from "@/redux/slices/game-options"

export default function Square({
    name,
    color,
    piece,
    isToMove = false,
}: {
    name: string
    color: Color
    piece: BoardElement
    isToMove?: boolean
}) {
    const dispatch = useAppDispatch()
    const fen = useAppSelector(selectFEN)
    const { level } = useAppSelector(selectBotOptions)
    const isPlayerTurn = useAppSelector(selectIsPlayerTurn)
    

    useEffect(() => {
        if (!isPlayerTurn) {
            // after player moves, it’s opponent's turn
            async function fetchBestMove() {
                const res = await getEngineResponse(fen, level)
                if (res.success) {
                    const bestMove = res.bestmove.split(" ")[1]
                    dispatch(
                        opponentMove({
                            from: bestMove.slice(0, 2) as Square,
                            to: bestMove.slice(2) as Square,
                        })
                    )
                }
            }
            fetchBestMove()
        }
    }, [fen, isPlayerTurn])

    async function handleClick() {
        if (isToMove) {
            dispatch(move(name as Square))
        } else {
            if (piece) dispatch(toMove(piece.square))
        }
    }

    return (
        <div
            className={cn("bg-amber-100 flex justify-center items-center", {
                "bg-amber-100": color === "w",
                "bg-red-700": color === "b",
            })}
            onClick={handleClick}
        >
            {piece && <Piece type={piece.type} color={piece.color} />}
            {isToMove && (
                <div className="md:size-7 size-5 bg-gray-500/60 rounded-full z-10 absolute" />
            )}
        </div>
    )
}

function Piece({
    type,
    color,
}: {
    type: string // example : p , n , ...
    color: "w" | "b"
}) {
    /// black is uppercase , white is lowercase
    const colorName = color == "b" ? "black" : "white"
    const name = getPieceName(type)
    const playerColor = useAppSelector(selectPlayerColor)


    return (
        <Image
            alt={type}
            width={55}
            height={55}
            src={`/images/chess-pieces/${colorName}-${name}.png`}
            className={cn("cursor-pointer",{
                'rotate-180' : playerColor === 'b'
            })}
        />
    )
}
