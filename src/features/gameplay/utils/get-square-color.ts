export function getSquareColor(index: number): "w" | "b" {
    const row = Math.floor(index / 8)
    const col = index % 8

    return (row + col) % 2 === 0 ? "w" : "b"
}