import { cn } from "@/lib/utils"
import { type Color, type Square } from "chess.js"
import { BoardElement } from "../types"
import { ReactNode } from "react"
import { Piece } from "./piece"
import { useDraggable, useDroppable } from "@dnd-kit/core"

export default function ChessBoardSquare({
    name,
    color,
    piece,
    isToMove = false,
    isLastMove,
    onClick,
    children,
}: {
    name: Square
    color: Color
    piece: BoardElement
    isToMove?: boolean
    isLastMove: boolean
    onClick: (square: Square, piece: BoardElement) => void
    children?: ReactNode
}) {
    const { setNodeRef :droppableRef, isOver } = useDroppable({
        id: name,
    })
    const { setNodeRef : draggableRef } = useDraggable({
        id: name,
        data: piece ? piece : undefined ,
    })
    return (
        <div
            ref={droppableRef}
            className={cn(
                "bg-amber-100 flex justify-center items-center relative",
                {
                    "bg-amber-100": color === "w",
                    "bg-red-700": color === "b",
                    "bg-amber-400": isLastMove && color == "w",
                    "bg-amber-300": isLastMove && color == "b",
                    "border-2 border-gray-200/50": isOver,
                }
            )}
            onClick={() => onClick(name, piece)}
        >
            {children}
            {piece && <Piece ref={draggableRef} type={piece.type} color={piece.color} />}
            {isToMove && (
                <div className="md:size-7 size-5 bg-gray-500/60 rounded-full z-10 absolute" />
            )}
        </div>
    )
}
