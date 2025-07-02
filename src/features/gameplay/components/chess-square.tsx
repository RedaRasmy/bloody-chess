import { cn } from "@/lib/utils"
import { getSquareColor } from "../utils/get-square-color"
import { Square } from "chess.js"
import { useDroppable } from "@dnd-kit/core"

export default function ChessSquare({
    squareName,
    isLastMove,
    onClick,
    isTarget,
    isPreMove,
}: {
    squareName: Square
    isLastMove: boolean
    onClick: (square: Square) => void
    isTarget: boolean
    isPreMove: boolean
}) {
    const color = getSquareColor(squareName)
    const { setNodeRef, isOver } = useDroppable({
        id: squareName,
    })
    return (
        <div
            data-testid={squareName}
            ref={setNodeRef}
            className={cn(
                "bg-amber-100 flex justify-center items-center relative w-full h-full",
                {
                    "bg-amber-100": color === "w",
                    "bg-red-700": color === "b",
                    "bg-amber-400": isLastMove && color == "w",
                    "bg-amber-300": isLastMove && color == "b",
                    "bg-red-500/50": isPreMove && color == "w",
                    "bg-red-500/30": isPreMove && color == "b",
                }
            )}
            onClick={() => onClick(squareName)}
        >
            {isTarget && (
                <div className="md:size-7 size-4 bg-gray-500/60 rounded-full z-10 absolute" />
            )}
        </div>
    )
}
