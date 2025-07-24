import { Piece, PieceSymbol } from "chess.js"

export default function calculatePoints(pieces: Piece[]): number {
    const valueByPieceSymbol: Record<PieceSymbol, number> = {
        p: 1,
        b: 3,
        n: 3,
        r: 5,
        q: 9,
        k: 0,
    }
    return pieces.reduce(
        (total, piece) => total + (valueByPieceSymbol[piece.type]),
        0
    )
}
