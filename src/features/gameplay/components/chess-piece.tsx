
import { cn } from "@/lib/utils"
import { BoardElement } from "../types"
import { getPieceName } from "../utils/getPieceName"
import Image from "next/image"
import { squareToCoords } from "../utils/square-to-coords"
import useChessBoardWidth from "@/hooks/useChessBoardWidth"

export default function ChessPiece({
    piece ,
    className,
    isRotated = false
}: {
    piece : Exclude<BoardElement , null>
    className? : string,
    isRotated?: boolean
}) {
    const {color,type ,square} = piece
    /// black is uppercase , white is lowercase
    const colorName = color == "b" ? "black" : "white"
    const name = getPieceName(type)

    const [x,y] = squareToCoords(square)
    const a = useChessBoardWidth()

    return (
        <Image
            data-testid={`${color}${type}`}
            alt={type}
            width={a/8}
            height={a/8}
            draggable={false}
            src={`/images/chess-pieces/${colorName}-${name}.png`}
            className={cn(`touch-none`, {
                "rotate-180": isRotated
            },className)}
        />
    )
}