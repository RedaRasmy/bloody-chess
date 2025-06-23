import { cn } from "@/lib/utils"
import { type Color, type Square } from "chess.js"
import { BoardElement } from "../types"
import { ReactNode } from "react"
import { Piece } from "./piece"
import { useDraggable, useDroppable } from "@dnd-kit/core"
import {CSS} from '@dnd-kit/utilities';

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
    const { setNodeRef: droppableRef, isOver } = useDroppable({
        id: name,
    })
    const {
        setNodeRef: draggableRef,
        listeners,
        attributes,
        transform,
        isDragging
    } = useDraggable({
        id: name,
        data: piece ? piece : undefined,
    })
    const style = {
        transform: CSS.Translate.toString(transform),
    }
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
                    "border-3 border-gray-400": isOver,
                }
            )}
            onClick={() => onClick(name, piece)}
        >
            {children}
            {piece && (
                <div
                    className={cn(" relative w-full h-full ",{
                        "z-50" : isDragging
                    })}
                    ref={draggableRef}
                    style={style}
                    {...listeners}
                    {...attributes}
                >
                    <Piece type={piece.type} color={piece.color} />
                </div>
            )}
            {isToMove && (
                <div className="md:size-7 size-5 bg-gray-500/60 rounded-full z-10 absolute" />
            )}
        </div>
    )
}
