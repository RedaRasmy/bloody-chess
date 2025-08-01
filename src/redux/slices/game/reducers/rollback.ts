import { WritableDraft } from "immer"
import { GameState } from "../game-types"
import { Chess } from "chess.js"
import getPieces from "@/features/gameplay/utils/get-pieces"
import { getGameOverState } from "@/features/gameplay/utils/get-gameover-cause"
import getLegalMoves from "@/features/gameplay/utils/get-legal-moves"
import updatePieces from "@/features/gameplay/utils/update-pieces"
import getDetailedMove from "@/features/gameplay/utils/get-detailed-move"

export function rollback(state: WritableDraft<GameState>) {
    // TODO : think about store capturedPices in game slice to optimize 
    // Why : we will not need to reconstruct pieces from scartch to just know the piece Id
    // maybe store them in History

    if (state.history.length <= 0) return

    const chess = new Chess()

    // // Get the validated move and detailed move for animation
    let pieces = getPieces()
    // Reconstruct game state from history
    state.history.slice(0,-1).forEach((mv) => {
        const validatedMove = chess.move({
            from: mv.from,
            to: mv.to,
            promotion: mv.promotion,
        })
        const detailedMove = getDetailedMove(validatedMove, pieces)
        pieces = updatePieces(pieces, detailedMove)
    })


    ////////////////////////////

    state.history.pop()
    

    state.pieces = pieces
    state.fen = chess.fen()
    state.currentTurn = chess.turn()
    state.gameOver = getGameOverState(chess)
    state.legalMoves = getLegalMoves(chess)
    state.activePiece = null
    state.currentMoveIndex--
}
