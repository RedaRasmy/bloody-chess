import { Chess, PieceSymbol } from "chess.js"
import { CapturedPieces, MoveType } from "../types"
import parseCapturedPieces from "./parse-captured-pieces"

export function getCapturedPieces(moves: MoveType[]): CapturedPieces {
    const captured: { white: PieceSymbol[]; black: PieceSymbol[] } = {
        white: [],
        black: [],
    }
    const chess = new Chess()

    moves.forEach((move) => {
        const Move = chess.move(move)
        if (Move.captured) {
            if (Move.color === "b") {
                captured.white.push(Move.captured)
            } else {
                captured.black.push(Move.captured)
            }
        }
    })

    return {
        w: parseCapturedPieces(captured.white),
        b: parseCapturedPieces(captured.black),
    }
}



