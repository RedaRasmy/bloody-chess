// import { RootState } from "@/redux/store"
// import { createSelector } from "@reduxjs/toolkit"

// export const selectPieces = (state: RootState) => state.game.pieces
// export const selectFEN = (state: RootState) => state.game.fen
// export const selectIsPlayerTurn = (state: RootState) => state.game.isPlayerTurn
// export const selectPlayerColor = (state: RootState) => state.game.playerColor

// export const selectGameOverData = createSelector(
//     [
//         (state: RootState) => state.game.gameOver,
//         (state: RootState) => state.game.playerColor,
//     ],
//     (gameOver, playerColor) => ({
//         isGameOver: gameOver.isGameOver,
//         isDraw: gameOver.isDraw,
//         isWin: gameOver.winner === playerColor,
//         reason: gameOver.,
//     })
// )

// export const selectLastMove = (state: RootState) => {
//     const index = state.game.currentMoveIndex
//     if (index === -1) return undefined
//     const move = state.game.history[index]
//     return move
// }
// export const selectIsGameOver = (state: RootState) =>
//     state.game.gameOver.isGameOver
// export const selectCapturedPieces = (state: RootState) =>
//     state.game.capturedPieces
// export const selectScore = (state: RootState) => state.game.score
// export const selectCurrentPlayer = (state: RootState) =>
//     state.game.isPlayerTurn
//         ? state.game.playerColor
//         : oppositeColor(state.game.playerColor)

// export const selectLegalMoves = (state: RootState) => state.game.legalMoves

// export const selectIsUndoRedoable = createSelector(
//     [
//         (state: RootState) => state.game.currentMoveIndex,
//         (state: RootState) => state.game.history.length,
//     ],
//     (currentMoveIndex, historyLen) => {
//         return {
//             isUndoable: currentMoveIndex >= 0,
//             isRedoable: currentMoveIndex < historyLen - 1,
//         }
//     }
// )
// export const selectPreMoves = createSelector(
//     [(state: RootState) => state.game.preMoves],
//     (premoves) => premoves
// )
// export const selectActivePiece = createSelector(
//     [(state: RootState) => state.game.activePiece],
//     (activePiece) => activePiece
// )
// export const selectIsNewGame = (state: RootState) => state.game.newGame