import { Move } from "chess.js"
import { DetailedMove, DetailedPiece } from "../types"
import { file, rank } from "./rank-file"

export default function getDetailedMove(
    move: Move,
    pieces: DetailedPiece[]
): DetailedMove {
    const isEnPassant = move.isEnPassant()


    return {
        from: move.from,
        to: move.to,
        promotion: move.promotion,
        isCapture: move.isCapture() || isEnPassant,
        isKingsideCastle: move.isKingsideCastle(),
        isQueensideCastle: move.isQueensideCastle(),
        captured: isEnPassant
            ? pieces.find(
                  (p) => p.square === `${file(move.to)}${rank(move.from)}`
              )
            : pieces.find((p) => p.square === move.to),
    }
}
