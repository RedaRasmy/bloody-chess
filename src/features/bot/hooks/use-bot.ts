import { useEffect } from "react"
import sleep from "@/utils/delay"
import { getEngineResponse } from "../chess-engine"
import { getBestMove } from "../utils/get-bestmove"
import { Chess, Move } from "chess.js"

export default function useBot({
    onMove,
    isBotTurn,
    fen,
    level,
    delay = 0,
}: {
    isBotTurn: boolean
    onMove: (move: Move, isCheck: boolean) => void
    fen: string
    level: number
    delay?: number
}) {
    useEffect(() => {
        if (isBotTurn) {
            async function fetchBestMove() {
                await sleep(delay)
                const res = await getEngineResponse(
                    fen,
                    level > 5 ? level - 5 : 1
                )
                if (res.success) {
                    const bestMove = getBestMove(res, level, fen)
                    const chess = new Chess(fen)
                    const move = chess.move(bestMove)
                    // dispatch(move(bestMove))
                    // playMoveSound(theMove, chess.inCheck())
                    onMove(move, chess.isCheck())
                }
            }
            fetchBestMove()
        }
    }, [isBotTurn, fen, level])
}
