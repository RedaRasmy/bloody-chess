import { Chess, PieceSymbol, Square } from "chess.js"
import { EngineResponse, MoveType } from "../types"

export function getBestMove(
    res: Extract<EngineResponse, { success: true }>,
    lvl: number,
    fen : string
): MoveType {


    const bestMove = res.bestmove.split(" ")[1]
    const from = bestMove.slice(0, 2) as Square
    const to = bestMove.slice(2, 4) as Square
    const promotion = bestMove.length === 5 ? bestMove.slice(5) as PieceSymbol : undefined

    const move = {from,to,promotion}


    if (lvl>0 && lvl<6) {
        const randomness = (60 - lvl*10)/100
        const isRandom = Math.random() < randomness

        if (isRandom) {
            const chess = new Chess(fen)
            const possibleMoves = chess.moves({verbose:true})
            const lastIndex = possibleMoves.length -1
            const randomMove = possibleMoves[Math.floor(Math.random()*lastIndex)]
            return {
                from : randomMove.from,
                to : randomMove.to,
                promotion : randomMove.promotion
            }
        } else {
            return move
        }

    } else if (lvl<21) {
        return move
    } else {
        throw new Error("Invalid bot lvl")
    }
}

