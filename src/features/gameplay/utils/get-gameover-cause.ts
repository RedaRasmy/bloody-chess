import { GameOverState } from "@/redux/slices/game/game-types"
import { Chess } from "chess.js"
import { DrawReason, WinReason } from "../types"

export function getGameoverCause({
    isCheckmate,
    isDrawByFiftyMoves,
    isInsufficientMaterial,
    isStalemate,
    isThreefoldRepetition,
    isResign,
    isTimeOut,
}: {
    isCheckmate: boolean
    isDrawByFiftyMoves: boolean
    isInsufficientMaterial: boolean
    isStalemate: boolean
    isThreefoldRepetition: boolean
    isResign: boolean
    isTimeOut: boolean
}) {
    if (isCheckmate) {
        return "Checkmate"
    } else if (isTimeOut) {
        return "Timeout"
    } else if (isDrawByFiftyMoves) {
        return "Fifty moves rule"
    } else if (isInsufficientMaterial) {
        return "Insufficient material"
    } else if (isStalemate) {
        return "Stalemate"
    } else if (isThreefoldRepetition) {
        return "Threefold repetition"
    } else if (isResign) {
        return "Resignation"
    }
}

// Todo : remove the func above and rename file

export function getGameOverState(chess: Chess): GameOverState {
    const isGameOver = chess.isGameOver()

    if (isGameOver) {
        const isDraw = chess.isDraw()
        if (isDraw) {
            const reason:DrawReason = chess.isThreefoldRepetition()
                ? "Threefold repetition"
                : chess.isDrawByFiftyMoves()
                ? "Fifty moves rule"
                : chess.isStalemate() 
                ? "Stalemate"
                : 'Insufficient material'
            return {
                isGameOver: true,
                isDraw: true,
                winner : null,
                reason
            }
        } else {
            return {
                isGameOver : true,
                isDraw : false,
                winner : 'w',
                reason : 'Checkmate'
            }
        }
    } else {
        return {
            isGameOver : false,
            isDraw : false,
            reason : null,
            winner : null
        }
    }
}
