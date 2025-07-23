import { RootState } from "@/redux/store"
import { createSelector } from "@reduxjs/toolkit"
import { Color } from "chess.js"

export const selectPieces = (state: RootState) => state.game.pieces
export const selectFEN = (state: RootState) => state.game.fen
export const selectIsPlayerTurn = (state: RootState) =>
    state.game.currentTurn === state.game.playerColor
export const selectPlayerColor = (state: RootState) => state.game.playerColor

export const selectGameOverData = createSelector(
    [
        (state: RootState) => state.game.gameOver,
        (state: RootState) => state.game.playerColor,
    ],
    (gameOver, playerColor) => ({
        isGameOver: gameOver.isGameOver,
        isDraw: gameOver.isDraw,
        isWin: gameOver.winner === playerColor,
        reason: gameOver.reason,
    })
)

export const selectLastMove = (state: RootState) => {
    const index = state.game.currentMoveIndex
    if (index === -1) return undefined
    const move = state.game.history[index]
    return move
}

export const selectIsGameOver = (state: RootState) =>
    state.game.gameOver.isGameOver

export const selectPlayers = (state: RootState) => state.game.players

export const selectWhitePlayer = createSelector(
  [selectPlayers],
  (players) => players.white
);

export const selectBlackPlayer = createSelector(
  [selectPlayers],
  (players) => players.black
);

export const selectCurrentPlayer = (state: RootState) => state.game.currentTurn

export const selectLegalMoves = (state: RootState) => state.game.legalMoves

export const selectIsUndoRedoable = createSelector(
    [
        (state: RootState) => state.game.currentMoveIndex,
        (state: RootState) => state.game.history.length,
    ],
    (currentMoveIndex, historyLen) => {
        return {
            isUndoable: currentMoveIndex >= 0,
            isRedoable: currentMoveIndex < historyLen - 1,
        }
    }
)
// export const selectPreMoves = createSelector(
//     [(state: RootState) => state.game.preMoves],
//     (premoves) => premoves
// )
export const selectActivePiece = createSelector(
    [(state: RootState) => state.game.activePiece],
    (activePiece) => activePiece
)
export const selectIsNewGame = (state: RootState) => state.game.newGame

export const selectTimerOption = (state:RootState) => state.game.timerOption

export const selectLastMoveAt = (state:RootState) => state.game.lastMoveAt
export const selectGameStartedAt = (state:RootState) => state.game.gameStartedAt