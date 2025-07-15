import ChessPieceImage from "./chess-piece-image"
import { Color } from "chess.js"
import { useOnClickOutside } from "@/hooks/useOnClickOutside"
import { RefObject, useRef } from "react"

export default function SelectPromotion({
    color,
    onChange,
    open,
    onClickOutside,
}: {
    color: Color
    onChange: (value: string) => void
    open: boolean
    onClickOutside: () => void
}) {
    const ref = useRef<HTMLDivElement>(null)
    useOnClickOutside(ref as RefObject<HTMLElement>, onClickOutside)

    if (open)
        return (
            <div
                ref={ref}
                className="grid grid-cols-2  p-2 grid-rows-2 w-1/2 gap-2 aspect-square absolute -translate-y-1/2 top-1/2 z-50 left-1/2 -translate-x-1/2 bg-gray-100 rounded-2xl"
            >
                <div
                    className="relative bg-gray-200 hover:bg-gray-300 rounded-lg"
                    onClick={() => onChange("q")}
                >
                    <ChessPieceImage
                        piece={{
                            color,
                            type: "q",
                        }}
                    />
                </div>
                <div
                    className="relative bg-gray-200 hover:bg-gray-300 rounded-lg"
                    onClick={() => onChange("n")}
                >
                    <ChessPieceImage
                        piece={{
                            color,
                            type: "n",
                        }}
                    />
                </div>
                <div
                    className="relative bg-gray-200 hover:bg-gray-300 rounded-lg"
                    onClick={() => onChange("r")}
                >
                    <ChessPieceImage
                        piece={{
                            color,
                            type: "r",
                        }}
                    />
                </div>
                <div
                    className="relative bg-gray-200 hover:bg-gray-300 rounded-lg"
                    onClick={() => onChange("b")}
                >
                    <ChessPieceImage
                        piece={{
                            color,
                            type: "b",
                        }}
                    />
                </div>
            </div>
        )
}
