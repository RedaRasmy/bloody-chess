import { useDraggable } from "@dnd-kit/core"
import { cn } from "@/lib/utils"
import { CSS } from "@dnd-kit/utilities"
import { BoardElement } from "../types"
import { useEffect, useState } from "react"
import { squareToCoords } from "../utils/square-to-coords"
import { motion } from "motion/react"
import ChessPieceImage from "./chess-piece-image"

export default function ChessPiece({
    data,
    className,
    boardWidth,
    reversed,
    animated,
    durationMs = 200,
    idle = false,
}: {
    data: Exclude<BoardElement, null>
    className?: string
    boardWidth: number
    reversed: boolean
    animated: boolean
    durationMs?: number
    idle?: boolean
}) {
    const { square, type, color } = data
    const { setNodeRef, listeners, attributes, transform, isDragging } =
        useDraggable({
            id: square,
            data,
        })
    const style = {
        transform: CSS.Translate.toString(transform),
    }

    const [x, y] = squareToCoords(square, reversed)

    const [justDropped, setJustDropped] = useState(false)
    const [isFirstRender, setIsFirstRender] = useState(true)

    useEffect(() => {
        // If this is first render or piece just appeared on a new square without moving
        // (like a captured piece being reintroduced), skip animation
        if (isFirstRender) {
            const timer = setTimeout(() =>  setIsFirstRender(false),durationMs)
            return () => clearTimeout(timer)
        }
    }, [])

    useEffect(() => {
        if (!isDragging && justDropped) {
            // Reset after a brief moment
            const timer = setTimeout(() => setJustDropped(false), durationMs/4)
            return () => clearTimeout(timer)
        }
        if (isDragging) {
            setJustDropped(true)
        }
    }, [isDragging, justDropped])

    const targetPosition = {
        x: x * (boardWidth / 8),
        y: y * (boardWidth / 8),
    }

    const sharedProps = {
        className: cn("absolute z-10", {
            "z-30": isDragging,
        }),
        style: {
            left: targetPosition.x,
            top: targetPosition.y,
        },
    }

    const draggableContent = idle ? (
        <ChessPieceImage
            piece={{
                type,
                color,
            }}
            size={boardWidth / 8}
        />
    ) : (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={cn(className)}
            style={style}
        >
            <ChessPieceImage
                piece={{
                    type,
                    color,
                }}
                size={boardWidth / 8}
            />
        </div>
    )

    if (!animated) {
        return <div {...sharedProps}>{draggableContent}</div>
    }

    return (
        <motion.div
            animate={targetPosition}
            transition={{
                duration: (justDropped || isFirstRender) ? 0 : durationMs / 1000, // Skip animation if just dropped
            }}
            className={cn("absolute z-10", {
                "z-30": isDragging,
            })}
        >
            {draggableContent}
        </motion.div>
    )
}
