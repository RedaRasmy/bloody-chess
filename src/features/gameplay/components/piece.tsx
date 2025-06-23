import Image from "next/image"
import { getPieceName } from "../utils/getPieceName"
import { useAppSelector } from "@/redux/hooks"
import { selectPlayerColor } from "@/redux/slices/game-slice"
import { cn } from "@/lib/utils"
import { Ref } from "react"

export function Piece({
    type,
    color,
    className,
    ref,
}: {
    type: string // example : p , n , ...
    color: "w" | "b"
    className? : string,
    ref : Ref<HTMLImageElement | null> | undefined
}) {
    /// black is uppercase , white is lowercase
    const colorName = color == "b" ? "black" : "white"
    const name = getPieceName(type)
    const playerColor = useAppSelector(selectPlayerColor)

    return (
        <Image
            ref={ref}
            alt={type}
            fill
            src={`/images/chess-pieces/${colorName}-${name}.png`}
            className={cn("cursor-grab ", {
                "rotate-180": playerColor === "b"
            },className)}
        />
    )
}

