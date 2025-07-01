
import { ComponentType, ReactNode } from "react"

export default function ChessBoardLayout({
    PlayerSection,
    OpponentSection,
    ChessBoard
}: {
    PlayerSection : ReactNode,
    OpponentSection : ReactNode ,
    ChessBoard : ReactNode
}) {
    return (
        <div className="flex flex-col w-full max-w-[75vh] gap-1">
            {PlayerSection}
            {ChessBoard}
            {OpponentSection}
        </div>
    )
}

