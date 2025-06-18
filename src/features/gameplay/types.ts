
import { Color, PieceSymbol, Square } from "chess.js";


export type BoardElement = {
        square: Square;
        type: PieceSymbol;
        color: Color;
} | null

export type EngineResponse = {
        success : true
        bestmove : string
        eval : number | null
        mate : number | null
        continuation : string
} | {
        success : false
        data : string
}

export type PromotionPiece = 'q' | 'n' | 'r' | 'b'