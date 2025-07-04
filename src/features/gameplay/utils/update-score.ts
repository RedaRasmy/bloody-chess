import { Color, PieceSymbol } from "chess.js";
import { CapturedPieces } from "../types";

export default function updateScoreAndCapturedPieces({
    score,
    capturedPieces,
    captured,
    promotion,
    playerColor,
    movePlayer 
}:{
    score : number
    capturedPieces : CapturedPieces
    captured : PieceSymbol | undefined
    promotion : PieceSymbol | undefined
    playerColor : Color
    movePlayer : Color
}):{
    score : number
    capturedPieces : CapturedPieces
} {
        if (!captured && !promotion ) return {
            score, capturedPieces
        }
        let outputScore = score
        const outputCapturedPieces = capturedPieces
        const isPlayer = movePlayer === playerColor

        const pieceColor = isPlayer
            ? playerColor === "w"
                ? "b"
                : "w"
            : playerColor
        const factor = isPlayer ? 1 : -1

        if (captured) {

            switch (captured) {
                case "p":
                    outputScore += factor
                    outputCapturedPieces[pieceColor][0]++
                    break
                case "b":
                    outputScore += factor * 3
                    outputCapturedPieces[pieceColor][1]++
                    break
                case "n":
                    outputScore += factor * 3
                    outputCapturedPieces[pieceColor][2]++
                    break
                case "r":
                    outputScore += factor * 5
                    outputCapturedPieces[pieceColor][3]++
                    break
                case "q":
                    outputScore += factor * 9
                    outputCapturedPieces[pieceColor][4]++
                    break
            }
        }
        if (promotion) {
            switch (promotion) {
                case 'q' : 
                    outputScore += factor*8
                    break
                case 'n' :
                    outputScore += factor*2
                    break
                case 'b' :
                    outputScore += factor*2
                    break
                case 'r' : 
                    outputScore += factor*4
            }
        }

        return {
            score : outputScore,
            capturedPieces : outputCapturedPieces
        }


}