import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"
import { Chess, Color, Square } from "chess.js"
import { RootState } from "../store"
import { changeColor } from "./game-options"
import { getGameoverCause } from "@/features/gameplay/utils/get-gameover-cause"

const initialState = {
    fen: new Chess().fen(),
    allowedSquares: [] as Square[],
    activePieceSquare: undefined as Square | undefined,
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
}

const gameSlice = createSlice({
    name: "game-state",
    initialState,
    reducers: {
        move: (state, action: PayloadAction<{ from: Square; to: Square }>) => {
            const { from, to } = action.payload

            const chess = new Chess(state.fen)

            chess.move({
                from,
                to,
            })

            state.fen = chess.fen()
            // clear moving states
            state.activePieceSquare = undefined
            state.allowedSquares = []

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
        },
        toMove: (state, { payload: pieceSquare }: PayloadAction<Square>) => {
            const chess = new Chess(state.fen)
            state.allowedSquares = chess
                .moves({
                    square: pieceSquare,
                    verbose: true,
                })
                .map((m) => m.to)

            console.log(state.allowedSquares)
            state.activePieceSquare = pieceSquare
        },
    },
    extraReducers: (builder) => {
        builder.addCase(changeColor, (state, action) => {
            const color = action.payload
            // const chess = new Chess(state.fen)

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

export const { toMove, move } = gameSlice.actions

export default gameSlice.reducer

// Selectors

export const selectBoard = (state: RootState) =>
    new Chess(state.game.fen).board()
export const selectAllowedSquares = (state: RootState) =>
    state.game.allowedSquares
export const selectFEN = (state: RootState) => state.game.fen
export const selectIsPlayerTurn = (state: RootState) => state.game.isPlayerTurn
export const selectPlayerColor = (state: RootState) => state.game.playerColor
export const selectActivePieceSquare = (state: RootState) =>
    state.game.activePieceSquare
export const selectGameOverData = (state: RootState) => ({
    isGameOver: state.game.isGameOver,
    isDraw: state.game.isDraw,
    isWin: state.game.winner === state.game.playerColor,
    cause: getGameoverCause({
        isCheckmate: state.game.isCheckmate,
        isDrawByFiftyMoves: state.game.isDrawByFiftyMoves,
        isInsufficientMaterial: state.game.isInsufficientMaterial,
        isStalemate: state.game.isStalemate,
        isThreefoldRepetition: state.game.isThreefoldRepetition,
    }),
})
