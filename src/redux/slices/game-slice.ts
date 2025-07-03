import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"
import { Chess, Color, DEFAULT_POSITION } from "chess.js"
import { RootState } from "../store"
import { changeColor } from "./game-options"
import { getGameoverCause } from "@/features/gameplay/utils/get-gameover-cause"
import { DetailedMove, MoveType } from "@/features/gameplay/types"
import { initialCaputeredPieces } from "@/features/gameplay/utils/constantes"
import { oppositeColor } from "@/features/gameplay/utils/opposite-color"
import getInitialPieces from "@/features/gameplay/utils/get-initial-pieces"
import updatePieces from "@/features/gameplay/utils/update-pieces"
import getLegalMoves from "@/features/gameplay/utils/get-legal-moves"

const initialState = {
    fen: DEFAULT_POSITION,
    history: [] as DetailedMove[],
    isPlayerTurn: true,
    isCheckmate: false,
    isDraw: false,
    isStalemate: false,
    isCheck: false,
    isInsufficientMaterial: false,
    isThreefoldRepetition: false,
    isDrawByFiftyMoves: false,
    isGameOver: false,
    winner: undefined as undefined | Color,
    playerColor: "w" as Color,
    isResign: false,
    currentMoveIndex: -1,
    score: 0,
    capturedPieces: initialCaputeredPieces,
    isTimeOut: false,
    legalMoves: getLegalMoves(new Chess()),
    pieces: getInitialPieces(),
}

const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
        undo: (state) => {
            state.pieces = updatePieces(
                state.pieces,
                state.history[state.currentMoveIndex],
                true
            )
            state.currentMoveIndex--
        },
        redo: (state) => {
            state.currentMoveIndex++
            state.pieces = updatePieces(
                state.pieces,
                state.history[state.currentMoveIndex]
            )
        },
        timeOut: (state) => {
            state.isTimeOut = true
            state.isGameOver = true
            state.winner = state.isPlayerTurn
                ? oppositeColor(state.playerColor)
                : state.playerColor
        },
        resign: (state) => {
            state.isResign = true
            state.isGameOver = true
            state.winner = state.playerColor === "w" ? "b" : "w"
        },
        replay: (state) => ({
            ...initialState,
            playerColor: state.playerColor,
            isPlayerTurn: state.playerColor === "w",
        }),
        move: (state, action: PayloadAction<MoveType>) => {
            if (
                state.isGameOver ||
                state.currentMoveIndex < state.history.length - 1
            )
                return
            const chess = new Chess()

            state.history.forEach((mv) => chess.move(mv))
            const theMove = chess.move(action.payload)

            const detailedMove = {
                from: theMove.from,
                to: theMove.to,
                promotion: theMove.promotion,
                isCapture: theMove.isCapture(),
                isKingsideCastle: theMove.isKingsideCastle(),
                isQueensideCastle: theMove.isQueensideCastle(),
                captured: state.pieces.find((p) => p.square === theMove.to),
            }
            state.history.push(detailedMove)

            // update pieces
            state.pieces = updatePieces(state.pieces, detailedMove)

            if (theMove.isCapture()) {
                const playerColor = state.playerColor
                const isPlayer = theMove.color === playerColor
                // maybe i should i add opponentColor in state
                const pieceColor = isPlayer
                    ? playerColor === "w"
                        ? "b"
                        : "w"
                    : playerColor
                const factor = isPlayer ? 1 : -1

                switch (theMove.captured) {
                    case "p":
                        state.score = state.score + factor
                        state.capturedPieces[pieceColor][0]++
                        break
                    case "b":
                        state.score = state.score + factor * 3
                        state.capturedPieces[pieceColor][1]++
                        break
                    case "n":
                        state.score = state.score + factor * 3
                        state.capturedPieces[pieceColor][2]++
                        break
                    case "r":
                        state.score = state.score + factor * 5
                        state.capturedPieces[pieceColor][3]++
                        break
                    case "q":
                        state.score = state.score + factor * 9
                        state.capturedPieces[pieceColor][4]++
                        break
                }
            }
            state.fen = chess.fen()
            if (!state.isPlayerTurn) {
                state.legalMoves = getLegalMoves(chess)
            }
            // change currentPlayer
            state.isPlayerTurn = !state.isPlayerTurn

            // clear moving states
            state.isCheckmate = chess.isCheckmate()
            state.isCheck = chess.isCheck()
            state.isDraw = chess.isDraw()
            state.isStalemate = chess.isStalemate()
            state.isInsufficientMaterial = chess.isInsufficientMaterial()
            state.isThreefoldRepetition = chess.isThreefoldRepetition()
            state.isDrawByFiftyMoves = chess.isDrawByFiftyMoves()
            state.isGameOver = chess.isGameOver()
            if (chess.isCheckmate()) {
                state.winner = chess.turn() === "w" ? "b" : "w"
            }
            state.currentMoveIndex = state.history.length - 1
        },
    },
    extraReducers: (builder) => {
        builder.addCase(changeColor, (state, action) => {
            const color = action.payload

            if (color == "black") {
                state.isPlayerTurn = false
                state.playerColor = "b"
            } else if (color == "random") {
                const randomColor: Color = Math.random() < 0.5 ? "w" : "b"
                state.isPlayerTurn = randomColor == "w"
                state.playerColor = randomColor
            } else {
                state.isPlayerTurn = true
                state.playerColor = "w"
            }
        })
    },
})

export const { timeOut, move, replay, resign, undo, redo } = gameSlice.actions

export default gameSlice.reducer

// Selectors

export const selectPieces = (state: RootState) => state.game.pieces
export const selectFEN = (state: RootState) => state.game.fen
export const selectIsPlayerTurn = (state: RootState) => state.game.isPlayerTurn
export const selectPlayerColor = (state: RootState) => state.game.playerColor
export const selectGameOverData = (state: RootState) => ({
    isGameOver: state.game.isGameOver,
    isDraw: state.game.isDraw,
    isWin: state.game.winner === state.game.playerColor,
    cause: getGameoverCause(state.game),
})
export const selectLastMove = (state: RootState) => {
    const index = state.game.currentMoveIndex
    if (index === -1) return undefined
    const move = state.game.history[index]
    return move
}
export const selectIsGameOver = (state: RootState) => state.game.isGameOver
export const selectCapturedPieces = (state: RootState) =>
    state.game.capturedPieces
export const selectScore = (state: RootState) => state.game.score
export const selectCurrentPlayer = (state: RootState) =>
    state.game.isPlayerTurn
        ? state.game.playerColor
        : oppositeColor(state.game.playerColor)

export const selectLegalMoves = (state: RootState) => state.game.legalMoves
export const selectisUndoRedoable = (state: RootState) => ({
    isUndoable: state.game.currentMoveIndex >= 0,
    isRedoable: state.game.currentMoveIndex < state.game.history.length - 1,
})
