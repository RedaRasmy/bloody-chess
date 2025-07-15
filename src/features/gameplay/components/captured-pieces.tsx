import { Color, PieceSymbol } from "chess.js"
import React from "react"
import ChessPieceImage from "./chess-piece-image"
import { CapturedPieces as CapturedPiecesTypes } from "../types"

export default function CapturedPieces({
    color,
    capturedPieces,
}: {
    color: Color
    capturedPieces: CapturedPiecesTypes["w"]
}) {
    const pieces: PieceSymbol[] = ["p", "b", "n", "r", "q"]

    return (
        <div className="flex items-center h-full ">
            {capturedPieces.map((num, index) => (
                <div
                    key={pieces[index]}
                    className="flex h-full -space-x-3 items-center justify-center"
                >
                    {Array.from({ length: num }, (_, i) => i).map((_, i) => (
                        <ChessPieceImage
                            key={i}
                            piece={{
                                color,
                                type: pieces[index],
                            }}
                            size={20}
                        />
                    ))}
                </div>
            ))}
        </div>
    )
}
