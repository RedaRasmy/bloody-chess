import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"
import { Chess, Color, Square } from "chess.js"
import { RootState } from "../store"
import { changeColor } from "./game-options"
import { getGameoverCause } from "@/features/gameplay/utils/get-gameover-cause"
import { BoardElement, MoveType } from "@/features/gameplay/types"
import { initialCaputeredPieces } from "@/features/gameplay/utils/constantes"
import { oppositeColor } from "@/features/gameplay/utils/opposite-color"

const initialState = {
    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    history: [] as MoveType[],
    allowedSquares: [] as Square[] | undefined,
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
    lastMove: undefined as undefined | MoveType,
    score: 0,
    capturedPieces: initialCaputeredPieces,
    isTimeOut : false
}

const gameSlice = createSlice({
    name: "game-state",
    initialState,
    reducers: {
        timeOut: (state) => {
            state.isTimeOut = true
            state.isGameOver = true
            state.winner = state.isPlayerTurn ? oppositeColor(state.playerColor) : state.playerColor

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
        move: (
            state,
            action: PayloadAction<{
                from: Square
                to: Square
                promotion?: string
            }>
        ) => {
            if (state.isGameOver) return;
            const { from, to, promotion } = action.payload

            const chess = new Chess()
            state.history.forEach((mv) => chess.move(mv))

            const theMove = chess.move({
                from,
                to,
                promotion,
            })

            state.history.push({
                from: theMove.from,
                to: theMove.to,
                promotion: theMove.promotion,
            })

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
                        // state.capturedPieces[pieceColor].p++
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
            // clear moving states
            state.allowedSquares = undefined

            // change currentPlayer
            state.isPlayerTurn = !state.isPlayerTurn

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
            state.lastMove = {
                from,
                to,
            }
        },
        toMove: (
            state,
            { payload: activePiece }: PayloadAction<Exclude<BoardElement, null>>
        ) => {
            if (state.isGameOver) return;
            const chess = new Chess(state.fen)
            state.allowedSquares = chess
                .moves({
                    square: activePiece.square,
                    verbose: true,
                })
                .map((m) => m.to)

        },
        cancelMove: (
            state
        ) => {
            state.allowedSquares = undefined
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

export const { timeOut,toMove, move, replay, resign, cancelMove } = gameSlice.actions

export default gameSlice.reducer

// Selectors

export const selectBoard = (state: RootState) =>
    new Chess(state.game.fen).board()
export const selectAllowedSquares = (state: RootState) =>
    state.game.allowedSquares
export const selectFEN = (state: RootState) => state.game.fen
export const selectIsPlayerTurn = (state: RootState) => state.game.isPlayerTurn
export const selectPlayerColor = (state: RootState) => state.game.playerColor
export const selectGameOverData = (state: RootState) => ({
    isGameOver: state.game.isGameOver,
    isDraw: state.game.isDraw,
    isWin: state.game.winner === state.game.playerColor,
    cause: getGameoverCause(state.game),
})
export const selectLastMove = (state: RootState) => state.game.lastMove
export const selectIsGameOver = (state: RootState) => state.game.isGameOver
export const selectCapturedPieces = (state: RootState) =>
    state.game.capturedPieces
export const selectScore = (state: RootState) => state.game.score
export const selectCurrentPlayer = (state:RootState) =>  state.game.isPlayerTurn ? state.game.playerColor : oppositeColor(state.game.playerColor)
export const selectIsNewGame = (state:RootState) => state.game.history.length === 0
