// export type Square = {
//     name : string
//     index : number
//     color : 'white' | 'black'
//     content : null | Char
// }

import { Color, PieceSymbol, Square } from "chess.js";

// export type Char = 'p' | 'P' | 'n' | 'N' | 'b' | 'B' | "r" | 'R' | 'q' | 'Q' | 'k' | 'K'


// export type Move = {
//     piece : Char
//     from : string
//     to : string
// }

export type BoardElement = {
        square: Square;
        type: PieceSymbol;
        color: Color;
} | null