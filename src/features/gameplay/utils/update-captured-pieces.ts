import { Color, PieceSymbol } from "chess.js"
import { CapturedPieces } from "../types"
import { oppositeColor } from "./opposite-color"

export default function updateCapturedPieces({
    capturedPieces,
    captured,
    movePlayer,
}: {
    capturedPieces: CapturedPieces
    captured: PieceSymbol | undefined
    movePlayer: Color
}): CapturedPieces {
    if (!captured) return capturedPieces

    const outputCapturedPieces = capturedPieces

    const pieceColor = oppositeColor(movePlayer)

    switch (captured) {
        case "p":
            outputCapturedPieces[pieceColor][0]++
            break
        case "b":
            outputCapturedPieces[pieceColor][1]++
            break
        case "n":
            outputCapturedPieces[pieceColor][2]++
            break
        case "r":
            outputCapturedPieces[pieceColor][3]++
            break
        case "q":
            outputCapturedPieces[pieceColor][4]++
            break
    }

    return outputCapturedPieces
}
