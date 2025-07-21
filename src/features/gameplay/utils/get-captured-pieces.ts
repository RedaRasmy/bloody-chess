import { SMove } from "@/db/types"
import { PieceSymbol } from "chess.js"
import { CapturedPieces } from "../types"
import parseCapturedPieces from "./parse-captured-pieces"

export function getCapturedPieces(moves: SMove[]): CapturedPieces {
    const captured: { white: PieceSymbol[]; black: PieceSymbol[] } = {
        white: [],
        black: [],
    }

    moves.forEach((move) => {
        if (move.capturedPiece) {
            const opponentColor = move.playerColor === "w" ? "b" : "w"
            if (opponentColor === "w") {
                captured.white.push(move.capturedPiece)
            } else {
                captured.black.push(move.capturedPiece)
            }
        }
    })

    return {
        w: parseCapturedPieces(captured.white),
        b: parseCapturedPieces(captured.black),
    }
}

// export function calculatePoints(capturedPieces: PieceSymbol[]): number {
//     const pieceValues = { 'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9, 'k': 0 };
//     return capturedPieces.reduce((total, piece) =>
//         total + (pieceValues[piece] || 0), 0);
// }
export function calculatePoints(capturedPieces: CapturedPieces["w"]): number {
    const valueByIndex: Record<number, number> = {
        0: 1,
        1: 3,
        2: 3,
        3: 5,
        4: 9,
        5: 0,
    }
    return capturedPieces.reduce(
        (total, num, i) => total + (valueByIndex[i] || 0) * num,
        0
    )
}
