"use client"
import ChessBoard from "@/features/gameplay/components/chess-board"
import { MoveType } from "@/features/gameplay/types"
import { DEFAULT_POSITION, PieceSymbol, Square } from "chess.js"
import { useSearchParams } from "next/navigation"

export default function Page() {
    const params = useSearchParams()
    const fen = params.get("fen") ?? DEFAULT_POSITION
    const lastMove = params.get("lastmove")
    const move: MoveType | undefined = lastMove
        ? {
              from: lastMove.slice(0, 2) as Square,
              to: lastMove.slice(2, 4) as Square,
              promotion: (lastMove[4] ?? undefined) as PieceSymbol | undefined,
          }
        : undefined

    return (
        <div className="flex justify-center items-center w-full h-full">
            <div className="w-full max-w-[85vh]">
                <ChessBoard fen={fen} move={move} />
            </div>
        </div>
    )
}
