import { Color } from "chess.js";

export function oppositeColor(color:Color):Color {
    return color === 'w' ? 'b' : 'w'
    
}