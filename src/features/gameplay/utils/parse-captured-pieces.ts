import { PieceSymbol } from "chess.js";
import { CapturedPieces } from "../types";

export default function parseCapturedPieces(pieces:PieceSymbol[]):CapturedPieces['w'] {
    const output : CapturedPieces['w']   = [0,0,0,0,0]

    pieces.forEach(piece=>{
        switch (piece) {
            case 'p' :
                output[0]++
                break
            case "b" :
                output[1]++
                break
            case "n" : 
                output[2]++
                break
            case "r" : 
                output[3]++
                break
            case "q" :
                output[4]++
        }
    })

    return output
}