import { cn } from "@/lib/utils"
import { ReactNode } from "react"
import { useDroppable } from "@dnd-kit/core"

export default function Droppable({id,children,className}: {
    id: string,
    className?: string,
    children?: ReactNode
}) {
    const { setNodeRef, isOver} = useDroppable({
        id,
    })

    return (
        <div
            ref={setNodeRef}

            className={cn(className,{
                'border-3 border-gray-400' : isOver,
            })}
        >
            {children}
        </div>
    )
}

