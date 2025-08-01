// export function undo(state: WritableDraft<GameState>) {
//     if (state.currentMoveIndex <= -1) return
//     if (state.currentMoveIndex === 0) {
//         state.pieces = getPieces()
//         state.currentMoveIndex = -1
//         return
//     }
//     let pieces = getPieces()
//     const chess = new Chess()
//     state.history.slice(0, state.currentMoveIndex).forEach((mv) => {
//         const validatedMove = chess.move({
//             from: mv.from,
//             to: mv.to,
//             promotion: mv.promotion,
//         })
//         const detailedMove = getDetailedMove(validatedMove, pieces)
//         pieces = updatePieces(pieces, detailedMove)
//     })
//     state.pieces = pieces
//     state.currentMoveIndex--
// }
