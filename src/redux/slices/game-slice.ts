import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"
import { Chess, Color, DEFAULT_POSITION, Square } from "chess.js"
import { RootState } from "../store"
import { changeColor } from "./game-options"
import { getGameoverCause } from "@/features/gameplay/utils/get-gameover-cause"
import { MoveType } from "@/features/gameplay/types"
import { initialCaputeredPieces } from "@/features/gameplay/utils/constantes"
import { oppositeColor } from "@/features/gameplay/utils/opposite-color"

const initialState = {
    fen: DEFAULT_POSITION ,
    history: [] as MoveType[],
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
    currentMoveIndex : -1,
    score: 0,
    capturedPieces: initialCaputeredPieces,
    isTimeOut: false,
    legalMoves: Object.groupBy(
        new Chess().moves({ verbose: true }).map((mv) => ({
            to: mv.to,
            from: mv.from,
            promotion: mv.promotion,
        })),
        (move) => move.from
    ),
    toUndo: [] as string[],
    toRedo: [] as string[],
    currentFen : DEFAULT_POSITION
}

const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
        undo: (state) => {
            const toUndo = state.toUndo.at(-1)
            if (!toUndo) return;
            state.toUndo.pop()
            state.toRedo.push(state.currentFen)
            state.currentFen = toUndo
            state.currentMoveIndex--
        },
        redo: (state) => {
            const toRedo = state.toRedo.at(-1)
            if (!toRedo) return;
            state.toRedo.pop()
            state.toUndo.push(state.currentFen)
            state.currentFen = toRedo
            state.currentMoveIndex++   
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
            if (state.isGameOver || state.toRedo.length > 0) return

            const chess = new Chess()
            state.history.forEach((mv) => chess.move(mv))

            state.history.push(action.payload)

            const theMove = chess.move(action.payload)

            state.currentFen = chess.fen()
            state.toUndo.push(state.fen)// old fen

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
            state.legalMoves = Object.groupBy(
                chess.moves({ verbose: true }).map((mv) => ({
                    from: mv.from,
                    to: mv.to,
                    promotion: mv.promotion,
                })),
                (move) => move.from
            )

            // clear moving states

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

export const { timeOut, move, replay, resign,undo,redo } = gameSlice.actions

export default gameSlice.reducer

// Selectors

export const selectBoard = (state: RootState) =>
    new Chess(state.game.currentFen).board().flat()
export const selectFEN = (state: RootState) => state.game.fen
export const selectCurrentFEN = (state: RootState) => state.game.currentFen
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
export const selectIsNewGame = (state: RootState) =>
    state.game.history.length === 0
export const selectAllowedSquares =
    (from: Square | null) => (state: RootState) => {
        if (!from) return []
        const allowedMoves = state.game.legalMoves[from]
        if (allowedMoves) {
            return allowedMoves.map((mv) => mv.to)
        } else {
            return []
        }
    }
export const selectLegalMoves = (state: RootState) => state.game.legalMoves
export const selectisUndoRedoable = (state:RootState) => ({
    isUndoable : state.game.toUndo.length > 0,
    isRedoable : state.game.toRedo.length > 0,
})
export const selectToRedo = (state:RootState) => state.game.toRedo