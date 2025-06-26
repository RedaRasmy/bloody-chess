import { useDraggable } from "@dnd-kit/core"
import { BoardElement } from "../types"
import { Piece } from "./piece"
import { cn } from "@/lib/utils"
import {CSS} from '@dnd-kit/utilities';
import { Square } from "chess.js";

export default function DraggablePiece({ piece, square }: { piece: Exclude<BoardElement,null> , square:Square }) {
    const { setNodeRef, listeners, attributes, transform, isDragging } =
        useDraggable({
            id: square,
            data: piece ? piece : undefined,
        })
    const style = {
        transform: CSS.Translate.toString(transform),
    }
    return (
        <div
            className={cn(" relative w-full h-full ", {
                "z-50": isDragging,
            })}
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
        >
            <Piece type={piece.type} color={piece.color} />
        </div>
    )
}
