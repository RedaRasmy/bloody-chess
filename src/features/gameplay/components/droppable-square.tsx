import { cn } from "@/lib/utils"
import { type Color, type Square } from "chess.js"
import { BoardElement } from "../types"
import { ReactNode } from "react"
import { useDroppable } from "@dnd-kit/core"
import ChessBoardSquare from "./chess-board-square"

export default function DroppableSquare(props: {
    name: Square
    piece: BoardElement
    isToMove?: boolean
    isLastMove: boolean
    onClick: (square: Square, piece: BoardElement) => void
    children?: ReactNode
}) {
    const { setNodeRef, isOver } = useDroppable({
        id: props.name,
    })

    return (
        <div
            ref={setNodeRef}
            className={cn("",{
                "border-3 border-gray-400": isOver,
            })}
        >
            <ChessBoardSquare {...props} />
        </div>
    )
}
