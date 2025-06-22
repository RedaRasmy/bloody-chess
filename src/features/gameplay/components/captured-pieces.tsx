import { useAppSelector } from "@/redux/hooks"
import { selectCapturedPieces } from "@/redux/slices/game-slice"
import { Color } from "chess.js"
import React from "react"
import { SmallPiece } from "./small-piece"

export default function CapturedPieces({ color }: { color: Color }) {
    const capturedPieces = useAppSelector(selectCapturedPieces)[color]
    const map = Object.entries(capturedPieces)

    return (
        <div className="flex items-center h-full">
            {map.map(([piece, num]) => (
                <div key={piece} className="flex h-full -space-x-3 items-center justify-center">
                    {Array.from({ length: num }).map((_, i) => (
                        <SmallPiece key={i} color={color} type={piece} className=""/>
                    ))}
                </div>
            ))}
        </div>
    )
}
