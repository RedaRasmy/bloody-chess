import { Chess, DEFAULT_POSITION } from "chess.js"
import { GameState } from "../game-types"
import { WritableDraft } from "immer"
import getDetailedMove from "@/features/gameplay/utils/get-detailed-move"
import updatePieces from "@/features/gameplay/utils/update-pieces"

export function redoToEnd(state: WritableDraft<GameState>) {
    // If already at the end, nothing to do
    if (state.currentMoveIndex === state.history.length - 1) return

    // If history is empty, nothing to redo
    if (state.history.length === 0) return
    // Get the starting FEN position
    const fen =
        state.currentMoveIndex < 0
            ? DEFAULT_POSITION
            : state.history[state.currentMoveIndex].fenAfter
    const chess = new Chess(fen)
    let pieces = [...state.pieces]

    // Get the moves to replay (from current position + 1 to end)
    const movesToReplay = state.history.slice(state.currentMoveIndex + 1)

    // Replay all remaining moves
    movesToReplay.forEach((mv) => {
        const validatedMove = chess.move({
            from: mv.from,
            to: mv.to,
            promotion: mv.promotion,
        })
        const detailedMove = getDetailedMove(validatedMove, pieces)
        pieces = updatePieces(pieces, detailedMove)
    })

    state.pieces = pieces
    state.currentMoveIndex = state.history.length - 1
}


