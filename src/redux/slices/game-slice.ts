// import type { PayloadAction } from "@reduxjs/toolkit"
// import { createSlice, createSelector } from "@reduxjs/toolkit"
// import { Chess, Color, DEFAULT_POSITION } from "chess.js"
// import { RootState } from "../store"
// import { changeColor } from "./game-options"
// import { getGameoverCause } from "@/features/gameplay/utils/get-gameover-cause"
// import { BoardElement, DetailedMove, MoveType } from "@/features/gameplay/types"
// import { initialCaputeredPieces } from "@/features/gameplay/utils/constantes"
// import { oppositeColor } from "@/features/gameplay/utils/opposite-color"
// import getInitialPieces from "@/features/gameplay/utils/get-pieces"
// import updatePieces from "@/features/gameplay/utils/update-pieces"
// import getLegalMoves from "@/features/gameplay/utils/get-legal-moves"
// import updateScoreAndCapturedPieces from "@/features/gameplay/utils/update-captured-pieces"
// import safeMove from "@/features/gameplay/utils/safe-move"
// // import { ChessTimerOption } from "@/features/gameplay/types"

// const initialState = {
//     fen: DEFAULT_POSITION,
//     history: [] as DetailedMove[],
//     isPlayerTurn: true,
//     isCheck: false,
//     playerColor: "w" as Color,
//     currentMoveIndex: -1,
//     score: 0,
//     capturedPieces: initialCaputeredPieces,
//     legalMoves: getLegalMoves(new Chess()),
//     pieces: getInitialPieces(),
//     preMoves: [] as MoveType[],
//     activePiece: null as BoardElement,
//     // timer: undefined as
//     //     | undefined
//     //     | {
//     //           option: ChessTimerOption
//     //           white: number
//     //           black: number
//     //       },
//     gameOver: {
//         isResign: false,
//         isDraw: false,
//         isInsufficientMaterial: false,
//         isThreefoldRepetition: false,
//         isGameOver: false,
//         isTimeOut: false,
//         isStalemate: false,
//         isDrawByFiftyMoves: false,
//         isCheckmate: false,
//         winner: undefined as undefined | Color,
//     },
//     newGame: false, // should change on new game
// }

// const gameSlice = createSlice({
//     name: "game",
//     initialState,
//     reducers: {
//         premove: (state, { payload: move }) => {
//             if (state.gameOver.isGameOver) return
//             state.preMoves.push(move)
//         },
//         removePremove: (state) => {
//             state.preMoves.shift()
//         },
//         undo: (state) => {
//             state.pieces = updatePieces(
//                 state.pieces,
//                 state.history[state.currentMoveIndex],
//                 true
//             )
//             state.currentMoveIndex--
//         },
//         redo: (state) => {
//             state.currentMoveIndex++
//             state.pieces = updatePieces(
//                 state.pieces,
//                 state.history[state.currentMoveIndex]
//             )
//         },
//         timeOut: (state) => {
//             state.gameOver.isTimeOut = true
//             state.gameOver.isGameOver = true
//             state.gameOver.winner = state.isPlayerTurn
//                 ? oppositeColor(state.playerColor)
//                 : state.playerColor
//         },
//         resign: (state) => {
//             state.gameOver.isResign = true
//             state.gameOver.isGameOver = true
//             state.gameOver.winner = state.playerColor === "w" ? "b" : "w"
//         },
//         replay: (state) => ({
//             ...initialState,
//             playerColor: state.playerColor,
//             isPlayerTurn: state.playerColor === "w",
//             newGame: !state.newGame,
//         }),
//         select: (state, action: PayloadAction<Exclude<BoardElement, null>>) => {
//             const piece = action.payload
//             state.activePiece = piece
//         },
//         move: (state, action: PayloadAction<MoveType>) => {
//             if (
//                 state.gameOver.isGameOver ||
//                 state.currentMoveIndex < state.history.length - 1
//             )
//                 return

//             const chess = new Chess()

//             state.history.forEach((mv) => chess.move(mv))

//             const theMove = safeMove(chess, action.payload)

//             if (!theMove) {
//                 return
//             }

//             const detailedMove = {
//                 from: theMove.from,
//                 to: theMove.to,
//                 promotion: theMove.promotion,
//                 isCapture: theMove.isCapture(),
//                 isKingsideCastle: theMove.isKingsideCastle(),
//                 isQueensideCastle: theMove.isQueensideCastle(),
//                 captured: state.pieces.find((p) => p.square === theMove.to),
//             }
//             state.history.push(detailedMove)

//             // update pieces
//             state.pieces = updatePieces(state.pieces, detailedMove)

//             // update score and captured pieces
//             // const { score, capturedPieces } = updateScoreAndCapturedPieces({
//             //     captured: theMove.captured,
//             //     promotion: theMove.promotion,
//             //     capturedPieces: state.capturedPieces,
//             //     movePlayer: theMove.color,
//             //     playerColor: state.playerColor,
//             //     score: state.score,
//             // })
//             // state.score = score
//             // state.capturedPieces = capturedPieces

//             state.fen = chess.fen()
//             if (!state.isPlayerTurn) {
//                 state.legalMoves = getLegalMoves(chess)
//             }
//             // change currentPlayer
//             state.isPlayerTurn = !state.isPlayerTurn

//             state.isCheck = chess.isCheck()
//             state.gameOver = {
//                 ...state.gameOver,
//                 winner: chess.isCheckmate()
//                     ? chess.turn() === "w"
//                         ? "b"
//                         : "w"
//                     : undefined,
//                 isCheckmate: chess.isCheckmate(),
//                 isDraw: chess.isDraw(),
//                 isStalemate: chess.isStalemate(),
//                 isInsufficientMaterial: chess.isInsufficientMaterial(),
//                 isThreefoldRepetition: chess.isThreefoldRepetition(),
//                 isDrawByFiftyMoves: chess.isDrawByFiftyMoves(),
//                 isGameOver: chess.isGameOver(),
//             }

//             state.currentMoveIndex = state.history.length - 1

//             state.activePiece = null
//         },
//     },
//     extraReducers: (builder) => {
//         builder.addCase(changeColor, (state, action) => {
//             const color = action.payload

//             if (color == "black") {
//                 state.isPlayerTurn = false
//                 state.playerColor = "b"
//             } else if (color == "random") {
//                 const randomColor: Color = Math.random() < 0.5 ? "w" : "b"
//                 state.isPlayerTurn = randomColor == "w"
//                 state.playerColor = randomColor
//             } else {
//                 state.isPlayerTurn = true
//                 state.playerColor = "w"
//             }
//         })
//     },
// })

// export const {
//     timeOut,
//     move,
//     replay,
//     resign,
//     undo,
//     redo,
//     premove,
//     removePremove,
//     select,
// } = gameSlice.actions

// export default gameSlice.reducer

// // Selectors

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
//         cause: getGameoverCause(gameOver),
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
