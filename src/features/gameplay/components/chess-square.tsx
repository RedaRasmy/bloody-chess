import { cn } from "@/lib/utils"
import { getSquareColor } from "../utils/get-square-color"
import { Square } from "chess.js"

export default function ChessSquare({
    squareName,
    isLastMove = false,
    onClick,
    isTarget,
    isPreMove = false,
}: {
    squareName: Square
    isLastMove?: boolean
    onClick: (square: Square) => void
    isTarget: boolean
    isPreMove?: boolean
}) {
    const color = getSquareColor(squareName)

    return (
        <div
            data-testid={squareName}
            className={cn(
                "bg-amber-100 flex justify-center items-center relative w-full h-full",
                {
                    "bg-amber-100": color === "w",
                    "bg-accent": color === "b",
                    "bg-amber-400": isLastMove && color == "w",
                    "bg-amber-300": isLastMove && color == "b",
                    "bg-red-500/70": isPreMove && color == "w",
                    "bg-red-500/50": isPreMove && color == "b",
                }
            )}
            onClick={() => {
                if (!isTarget) onClick(squareName)
            }}
        >
            {isTarget && (
                <div
                    onClick={() => onClick(squareName)}
                    className="z-20 absolute flex justify-center items-center w-full h-full"
                >
                    <div className=" lg:size-6 size-5 bg-gray-500/60 rounded-full " />
                </div>
            )}
        </div>
    )
}
