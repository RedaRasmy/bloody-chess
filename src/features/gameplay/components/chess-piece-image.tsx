import { cn } from "@/lib/utils"
import { getPieceName } from "../utils/getPieceName"
import Image from "next/image"
import { Ref } from "react"
import { Piece } from "chess.js"

export default function ChessPieceImage({
    piece,
    className,
    rotated = false,
    size ,
    ref
}: {
    piece: Piece
    className?: string
    rotated?: boolean
    size? : number
    ref? : Ref<HTMLImageElement | null> | undefined
}) {
    const { color, type } = piece
    /// black is uppercase , white is lowercase
    const colorName = color == "b" ? "black" : "white"
    const name = getPieceName(type)

    return (
        <Image
            data-testid={`${color}${type}`}
            ref={ref}
            alt={type}
            width={size}
            height={size}
            fill={!size}
            sizes="(max-width:50px)"
            draggable={false}
            src={`/images/chess-pieces/${colorName}-${name}.png`}
            className={cn(
                `select-none`,
                {
                    "rotate-180": rotated,
                },
                className
            )}
        />
    )
}