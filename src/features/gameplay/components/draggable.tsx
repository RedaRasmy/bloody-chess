import { useDraggable } from "@dnd-kit/core"
import { cn } from "@/lib/utils"
import { CSS } from "@dnd-kit/utilities"
import { BoardElement } from "../types"
import { ReactNode, useEffect, useState } from "react"
import { squareToCoords } from "../utils/square-to-coords"
import { Square } from "chess.js"
import { motion } from "motion/react"

export default function Draggable({
    square,
    data,
    children,
    className,
    boardWidth,
    isReversed
}: {
    data: Exclude<BoardElement, null> | undefined
    children: ReactNode
    className?: string
    square: Square
    boardWidth: number
    isReversed:boolean
}) {
    const { setNodeRef, listeners, attributes, transform, isDragging } =
        useDraggable({
            id: square,
            data,
        })
    const style = {
        transform: CSS.Translate.toString(transform),
    }

    const [x, y] = squareToCoords(square,isReversed)

    const [justDropped, setJustDropped] = useState(false)

    useEffect(() => {
        if (!isDragging && justDropped) {
            // Reset after a brief moment
            const timer = setTimeout(() => setJustDropped(false), 50)
            return () => clearTimeout(timer)
        }
        if (isDragging) {
            setJustDropped(true)
        }
    }, [isDragging, justDropped])

    return (
        <motion.div
            // Outer wrapper: handles layout and framer positioning
            initial={{
                x: x * (boardWidth / 8),
                y: y * (boardWidth / 8),
            }}
            animate={{
                x: x * (boardWidth / 8),
                y: y * (boardWidth / 8),
            }}
            layout
            transition={{
                duration: justDropped ? 0 : 0.2, // Skip animation if just dropped
            }}
            className={cn("absolute z-10",{
                'z-30' : isDragging
            })}
        >
            <div
                ref={setNodeRef}
                {...listeners}
                {...attributes}
                className={cn( className)}
                style={style}
            >
                {children}
            </div>
        </motion.div>
    )
}
