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
            if (move.playerColor === "b") {
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



