import { Square } from "chess.js";

export function rank(square:Square) {
    return square.slice(1)
}
export function file(square:Square) {
    return square.slice(0)
}