import { cn } from "@/lib/utils"
import { ReactNode } from "react"
import { useDroppable } from "@dnd-kit/core"

export default function Droppable({id,overStyling="",children,className}: {
    id: string,
    overStyling?: string,
    className?: string,
    children?: ReactNode
}) {
    const { setNodeRef, isOver} = useDroppable({
        id,
    })

    return (
        <div
            ref={setNodeRef}
            className={cn(className, {
                overStyling : isOver,
            })}
        >
            {children}
        </div>
    )
}

