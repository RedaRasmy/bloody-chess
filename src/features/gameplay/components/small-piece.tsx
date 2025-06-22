import Image from "next/image"
import { getPieceName } from "../utils/getPieceName"
import { cn } from "@/lib/utils"

export function SmallPiece({
    type,
    color,
    className,
}: {
    type: string // example : p , n , ...
    color: "w" | "b"
    className? : string
}) {
    /// black is uppercase , white is lowercase
    const colorName = color == "b" ? "black" : "white"
    const name = getPieceName(type)

    return (
        <Image
            alt={type}
            width={20}
            height={20}
            src={`/images/chess-pieces/${colorName}-${name}.png`}
            className={cn("cursor-pointer", {
                // "rotate-180": playerColor === "b"
            },className)}
        />
    )
}