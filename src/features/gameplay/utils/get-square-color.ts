import { Square } from "chess.js"

export function getSquareColor(square: Square): "w" | "b" {
    const rank = parseInt(square[1]) // '1' to '8'
    const file = square.charCodeAt(0) - 'a'.charCodeAt(0) // 'a' = 0, 'b' = 1, ..., 'h' = 7

    return (rank + file) % 2 === 0 ? "w" : "b"
}