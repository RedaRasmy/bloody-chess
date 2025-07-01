import { useDraggable } from "@dnd-kit/core"
import { cn } from "@/lib/utils"
import { CSS } from "@dnd-kit/utilities"
import { BoardElement } from "../../types"
import { ReactNode, useEffect, useState } from "react"
import { squareToCoords } from "../../utils/square-to-coords"
import { Square } from "chess.js"
import { motion } from "motion/react"
import useChessBoardWidth from "@/hooks/useChessBoardWidth"

export default function Draggable({
    id,
    square,
    data,
    children,
    className,
}: {
    id: string
    data: Exclude<BoardElement, null> | undefined
    children: ReactNode
    className?: string,
    square: Square
}) {
    const { setNodeRef, listeners, attributes, transform, isDragging } =
        useDraggable({
            id,
            data,
        })
    const style = {
        transform: CSS.Translate.toString(transform),
    }
    const dragStyle = {
        transform: transform
            ? `translate(${transform.x}px, ${transform.y}px)`
            : "none",
    }

    const [x, y] = squareToCoords(square)

    const a = useChessBoardWidth()

    return (
        <motion.div
            // Outer wrapper: handles layout and framer positioning
            animate={{
                x: x * (a/8),
                y: y * (a/8),
            }}
            // initial={false}
            layoutId={id}
            // layout
            transition={{ duration: 0.5 }}
            className="absolute"
        >
            <div
                ref={setNodeRef}
                {...listeners}
                {...attributes}
                className={cn({ "z-50": isDragging }, className)}
                style={{
                    transform: transform
                        ? CSS.Translate.toString(transform)
                        : undefined,
                }}
            >
                {children}
            </div>
        </motion.div>
    )
}
