import { useDraggable } from "@dnd-kit/core"
import { cn } from "@/lib/utils"
import { CSS } from "@dnd-kit/utilities"
import { BoardElement } from "../types"
import { ReactNode, useEffect, useState } from "react"
import { squareToCoords } from "../utils/square-to-coords"
import { Square } from "chess.js"
import { motion } from "motion/react"
import useChessBoardWidth from "@/hooks/useChessBoardWidth"

export default function Draggable({
    square,
    data,
    children,
    className,
}: {
    data: Exclude<BoardElement, null> | undefined
    children: ReactNode
    className?: string
    square: Square
}) {
    console.log('draggable compo runs !')
    const { setNodeRef, listeners, attributes, transform, isDragging } =
        useDraggable({
            id : square,
            data,
        })
    const style = {
        transform: CSS.Translate.toString(transform),
    }

    const [x, y] = squareToCoords(square)

    const a = useChessBoardWidth()

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

    if (a === 0) {
        return null // Avoid rendering if board width is not set
    }
    return (
        <motion.div
            // Outer wrapper: handles layout and framer positioning
            initial={{
                x: x * (a / 8),
                y: y * (a / 8),
            }}
            animate={{
                x: x * (a / 8),
                y: y * (a / 8),
            }}
            layout
            transition={{
                duration: justDropped ? 0 : 0.2, // Skip animation if just dropped
            }}
            className="absolute"
        >
            <div
                ref={setNodeRef}
                {...listeners}
                {...attributes}
                className={cn({ "z-10": isDragging }, className)}
                style={style}
            >
                {children}
            </div>
        </motion.div>
    )
}
