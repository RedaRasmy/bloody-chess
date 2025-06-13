
import { Color, PieceSymbol, Square } from "chess.js";


export type BoardElement = {
        square: Square;
        type: PieceSymbol;
        color: Color;
} | null