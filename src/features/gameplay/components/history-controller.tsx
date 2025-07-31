import { Button } from "@/components/ui/button"
import {
    ChevronsLeft,
    ChevronLeft,
    ChevronRight,
    ChevronsRight,
} from "lucide-react"

export default function HistoryController({
    onUndo,
    onRedo,
    onStart,
    onEnd,
}: {
    onUndo: () => void
    onRedo: () => void
    onStart: () => void
    onEnd: () => void
}) {
    return (
        <div className="grid grid-cols-4 w-full bg-gray-400 ">
            <button
                onClick={onStart}
                className="w-full cursor-pointer hover:bg-gray-700 py-1"
            >
                <ChevronsLeft className="size-9 stroke-white font-bold mx-auto" />
            </button>
            <button
                onClick={onUndo}
                className="w-full cursor-pointer hover:bg-gray-700"
            >
                <ChevronLeft className="size-9 stroke-white font-bold mx-auto" />
            </button>
            <button
                onClick={onRedo}
                className="w-full cursor-pointer hover:bg-gray-700"
            >
                <ChevronRight className="size-9 stroke-white font-bold mx-auto" />
            </button>
            <button
                onClick={onEnd}
                className="w-full cursor-pointer hover:bg-gray-700"
            >
                <ChevronsRight className="size-9 stroke-white font-bold mx-auto" />
            </button>
        </div>
    )
}
