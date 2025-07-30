import { WritableDraft } from "immer"
import { GameState } from "../game-types"
import { Chess } from "chess.js"
import getPieces from "@/features/gameplay/utils/get-pieces"
import { getGameOverState } from "@/features/gameplay/utils/get-gameover-cause"
import getLegalMoves from "@/features/gameplay/utils/get-legal-moves"
import updatePieces from "@/features/gameplay/utils/update-pieces"
import getDetailedMove from "@/features/gameplay/utils/get-detailed-move"

export function rollback(state: WritableDraft<GameState>) {
    // Remove the last move
    const move = state.history.at(-1)
    if (!move) return;

    // Create chess instance with full history to get the detailed move
    const chessWithMove = new Chess()
    state.history.slice(0,-1).forEach((mv) => {
        chessWithMove.move({
            from: mv.from,
            to: mv.to,
            promotion: mv.promotion,
        })
    })

    // Get the validated move and detailed move for animation

    const validatedMove = chessWithMove.move(move)
    const detailedMove = getDetailedMove(validatedMove, state.pieces)

    // update pieces with updatePieces func to enable rollback animation
    state.pieces = updatePieces(state.pieces, detailedMove, true)

    ////////////////////////////

    state.history.pop()

    const chess = new Chess()

    state.currentMoveIndex = state.history.length - 1

    // Reconstruct game state from history
    state.history.forEach((mv) => {
        chess.move({
            from: mv.from,
            to: mv.to,
            promotion: mv.promotion,
        })
    })

    // Reset state to before the failed move
    state.fen = chess.fen()
    state.pieces = getPieces(chess.fen())
    state.currentTurn = chess.turn()
    state.isCheck = chess.isCheck()
    state.gameOver = getGameOverState(chess)
    state.legalMoves = getLegalMoves(chess)
    state.activePiece = null


}
