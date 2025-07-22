import { Move } from "chess.js";
import { DetailedMove, DetailedPiece } from "../types";

export default function getDetailedMove(move:Move,pieces:DetailedPiece[]):DetailedMove {
    return {
        from: move.from,
        to: move.to,
        promotion: move.promotion,
        isCapture: move.isCapture(),
        isKingsideCastle: move.isKingsideCastle(),
        isQueensideCastle: move.isQueensideCastle(),
        captured: pieces.find((p) => p.square === move.to),
    }
}
