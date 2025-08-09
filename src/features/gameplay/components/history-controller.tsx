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
        <div className="grid grid-cols-4 w-full bg-accent/50 ">
            <button
                onClick={onStart}
                className="w-full cursor-pointer hover:bg-accent py-1"
            >
                <ChevronsLeft className="size-9 stroke-white font-bold mx-auto" />
            </button>
            <button
                onClick={onUndo}
                className="w-full cursor-pointer hover:bg-accent"
            >
                <ChevronLeft className="size-9 stroke-white font-bold mx-auto" />
            </button>
            <button
                onClick={onRedo}
                className="w-full cursor-pointer hover:bg-accent"
            >
                <ChevronRight className="size-9 stroke-white font-bold mx-auto" />
            </button>
            <button
                onClick={onEnd}
                className="w-full cursor-pointer hover:bg-accent"
            >
                <ChevronsRight className="size-9 stroke-white font-bold mx-auto" />
            </button>
        </div>
    )
}
