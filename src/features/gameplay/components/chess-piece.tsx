import { cn } from "@/lib/utils"
import { BoardElement } from "../types"
import { getPieceName } from "../utils/getPieceName"
import Image from "next/image"

export default function ChessPiece({
    piece,
    className,
    isRotated = false,
    boardWidth: boardWidth,
}: {
    piece: Exclude<BoardElement, null>
    className?: string
    isRotated?: boolean
    boardWidth: number
}) {
    const { color, type } = piece
    /// black is uppercase , white is lowercase
    const colorName = color == "b" ? "black" : "white"
    const name = getPieceName(type)

    return (
        <Image
            data-testid={`${color}${type}`}
            alt={type}
            width={boardWidth / 8}
            height={boardWidth / 8}
            draggable={false}
            src={`/images/chess-pieces/${colorName}-${name}.png`}
            className={cn(
                `touch-none`,
                {
                    "rotate-180": isRotated,
                },
                className
            )}
        />
    )
}
