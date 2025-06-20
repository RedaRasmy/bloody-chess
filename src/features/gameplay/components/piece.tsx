import Image from "next/image"
import { getPieceName } from "../utils/getPieceName"
import { useAppSelector } from "@/redux/hooks"
import { selectPlayerColor } from "@/redux/slices/game-slice"
import { cn } from "@/lib/utils"

export function Piece({
    type,
    color,
}: {
    type: string // example : p , n , ...
    color: "w" | "b"
}) {
    /// black is uppercase , white is lowercase
    const colorName = color == "b" ? "black" : "white"
    const name = getPieceName(type)
    const playerColor = useAppSelector(selectPlayerColor)

    return (
        <Image
            alt={type}
            fill
            src={`/images/chess-pieces/${colorName}-${name}.png`}
            className={cn("cursor-pointer", {
                "rotate-180": playerColor === "b",
            })}
        />
    )
}

