import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"
import { Chess, Color, Square } from "chess.js"
import { RootState } from "../store"
import { changeColor } from "./game-options"
import { getGameoverCause } from "@/features/gameplay/utils/get-gameover-cause"
import { BoardElement } from "@/features/gameplay/types"
import { initialCaputeredPieces } from "@/features/gameplay/utils/constantes"

const initialState = {
    fen: new Chess().fen(),
    allowedSquares: [] as Square[],
    activePiece : null as BoardElement,
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
    lastMove : undefined as undefined | {from:Square,to:Square},
    score : 0 ,
    capturedPieces : initialCaputeredPieces
}

const gameSlice = createSlice({
    name: "game-state",
    initialState,
    reducers: {
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
            const { from, to, promotion } = action.payload

            const chess = new Chess(state.fen)

            const theMove = chess.move({
                from,
                to,
                promotion,
            })

            if (theMove.isCapture()) {
                const playerColor = state.playerColor
                const isPlayer = theMove.color === playerColor
                // maybe i should i add opponentColor in state
                const pieceColor = isPlayer ? (playerColor === 'w' ? 'b' : 'w') : playerColor 
                const factor = isPlayer ? 1 : -1

                switch (theMove.captured) {
                    case "p" : 
                        state.score =+ factor
                        state.capturedPieces[pieceColor].p++
                        break
                    case "b" : 
                        state.score =+ factor*3
                        state.capturedPieces[pieceColor].b++
                        break
                    case "n" : 
                        state.score =+ factor*3
                        state.capturedPieces[pieceColor].n++
                        break
                    case "r" : 
                        state.score =+ factor*5
                        state.capturedPieces[pieceColor].r++
                        break
                    case "q" : 
                        state.score =+ factor*9
                        state.capturedPieces[pieceColor].q++
                        break
                }
                
            }

            state.fen = chess.fen()
            // clear moving states
            state.activePiece = null
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
            state.lastMove = {
                from, to
            } 
        },
        toMove: (state, { payload: activePiece }: PayloadAction<Exclude<BoardElement , null>>) => {
            const chess = new Chess(state.fen)
            state.allowedSquares = chess
                .moves({
                    square: activePiece.square,
                    verbose: true,
                })
                .map((m) => m.to)

            state.activePiece = activePiece
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

export const { toMove, move, replay, resign } = gameSlice.actions

export default gameSlice.reducer

// Selectors

export const selectBoard = (state: RootState) =>
    new Chess(state.game.fen).board()
export const selectAllowedSquares = (state: RootState) =>
    state.game.allowedSquares
export const selectFEN = (state: RootState) => state.game.fen
export const selectIsPlayerTurn = (state: RootState) => state.game.isPlayerTurn
export const selectPlayerColor = (state: RootState) => state.game.playerColor
export const selectActivePiece = (state: RootState) =>
    state.game.activePiece
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
        isResign: state.game.isResign,
    }),
})
export const selectLastMove = (state:RootState) => state.game.lastMove