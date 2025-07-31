import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"
import { Chess, Color, DEFAULT_POSITION } from "chess.js"
import { changeBotTimer, changeColor, changeLevel } from "../game-options"
import { BoardElement } from "@/features/gameplay/types"
import { initialCaputeredPieces } from "@/features/gameplay/utils/constantes"
import getLegalMoves from "@/features/gameplay/utils/get-legal-moves"
import { GameState, Timings } from "./game-types"
import { setup, sync } from "../multiplayer/multiplayer-slice"
import parseTimerOption from "@/features/gameplay/utils/parse-timer-option"
import * as reducers from "./reducers"
import { onSync, onSetup } from "./extra-reducers"
import { oppositeColor } from "@/features/gameplay/utils/opposite-color"
import { calculateTimeLeft } from "@/features/gameplay/utils/calculate-time-left"
import updatePieces from "@/features/gameplay/utils/update-pieces"
import getDetailedMove from "@/features/gameplay/utils/get-detailed-move"
import getPieces from "@/features/gameplay/utils/get-pieces"

const initialState: GameState = {
    fen: DEFAULT_POSITION,
    history: [],
    currentTurn: "w",
    playerColor: "w",
    currentMoveIndex: -1,
    legalMoves: getLegalMoves(new Chess()),
    pieces: getPieces(),
    activePiece: null,
    timerOption: null,
    players: {
        white: {
            name: "",
            timeLeft: null,
            capturedPieces: initialCaputeredPieces.b,
            extraPoints: 0,
        },
        black: {
            name: "",
            timeLeft: null,
            capturedPieces: initialCaputeredPieces.w,
            extraPoints: 0,
        },
    },
    gameOver: {
        isGameOver: false,
        winner: null,
        isDraw: false,
        reason: null,
    },
    newGame: false, // should change on new game // remove this later ?
    lastMoveAt: null,
    gameStartedAt: null,
}

const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
        ...reducers,
        updateTimings: (state, action: PayloadAction<Partial<Timings>>) => ({
            ...state,
            ...action.payload,
        }),
        undoToStart: (state) => {
            state.pieces = getPieces()
            state.currentMoveIndex = -1
        },
        undo: (state) => {
            if (state.currentMoveIndex <= -1) return
            if (state.currentMoveIndex === 0) {
                state.pieces = getPieces()
                state.currentMoveIndex = -1
                return
            }
            let pieces = getPieces()
            const chess = new Chess()
            state.history.slice(0, state.currentMoveIndex).forEach((mv) => {
                const validatedMove = chess.move({
                    from: mv.from,
                    to: mv.to,
                    promotion: mv.promotion,
                })
                const detailedMove = getDetailedMove(validatedMove, pieces)
                pieces = updatePieces(pieces, detailedMove)
            })
            state.pieces = pieces
            state.currentMoveIndex--
        },
        redo: (state) => {
            if (state.currentMoveIndex === state.history.length - 1) return
            const fen =
                state.currentMoveIndex < 0
                    ? DEFAULT_POSITION
                    : state.history[state.currentMoveIndex].fenAfter
            const chess = new Chess(fen)
            const mv = state.history[state.currentMoveIndex + 1]

            const validatedMove = chess.move({
                from: mv.from,
                to: mv.to,
                promotion: mv.promotion,
            })
            const detailedMove = getDetailedMove(validatedMove, state.pieces)
            state.pieces = updatePieces(state.pieces, detailedMove)
            state.currentMoveIndex++
        },
        redoToEnd: (state) => {
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
            const movesToReplay = state.history.slice(
                state.currentMoveIndex + 1
            )

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
        },
        resign: (state, action: PayloadAction<Color | undefined>) => {
            const color = action.payload // resigner
            state.gameOver.reason = "Resignation"
            state.gameOver.isGameOver = true
            state.gameOver.winner = color
                ? oppositeColor(color)
                : state.playerColor === "w"
                ? "b"
                : "w"
        },
        correctTimers: (state) => {
            if (
                state.players.white.timeLeft !== null &&
                state.players.black.timeLeft !== null &&
                state.gameStartedAt
            ) {
                console.log("correctTimers reducer runs...")
                const { whiteTimeLeft, blackTimeLeft } = calculateTimeLeft({
                    whiteTimeLeft: state.players.white.timeLeft,
                    blackTimeLeft: state.players.black.timeLeft,
                    currentTurn: state.currentTurn,
                    lastMoveAt: state.lastMoveAt
                        ? new Date(state.lastMoveAt)
                        : new Date(state.gameStartedAt),
                })
                console.log(
                    "correctTimers -- last date reference : ",
                    state.lastMoveAt
                        ? new Date(state.lastMoveAt)
                        : new Date(state.gameStartedAt)
                )
                console.log(
                    "correctTimers -- white diff : ",
                    state.players.white.timeLeft - whiteTimeLeft
                )
                console.log(
                    "correctTimers -- black diff : ",
                    state.players.black.timeLeft - blackTimeLeft
                )
                state.players.white.timeLeft = whiteTimeLeft
                state.players.black.timeLeft = blackTimeLeft
            }
        },
        play: (
            state,
            action: PayloadAction<{
                playerName: string
                opponentName: string
            }>
        ) => {
            const { playerName, opponentName } = action.payload
            const timerOption = state.timerOption
            const timer = timerOption
                ? parseTimerOption(timerOption)
                : { base: null }

            const base = timer.base ? timer.base * 1000 : null
            const playerColor = state.playerColor
            const whiteName = playerColor === "w" ? playerName : opponentName
            const blackName = playerColor === "w" ? opponentName : playerName
            return {
                ...initialState,
                playerColor: state.playerColor,
                isPlayerTurn: state.playerColor === "w",
                newGame: !state.newGame,
                timerOption: state.timerOption,
                gameStartedAt: Date.now(),
                players: {
                    white: {
                        capturedPieces: initialCaputeredPieces.w,
                        timeLeft: base,
                        name: whiteName,
                        extraPoints: 0,
                    },
                    black: {
                        capturedPieces: initialCaputeredPieces.w,
                        timeLeft: base,
                        name: blackName,
                        extraPoints: 0,
                    },
                },
            }
        },
        select: (state, action: PayloadAction<Exclude<BoardElement, null>>) => {
            const piece = action.payload
            state.activePiece = piece
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(changeColor, (state, action) => {
                const color = action.payload

                if (color == "black") {
                    state.playerColor = "b"
                } else if (color == "random") {
                    const randomColor: Color = Math.random() < 0.5 ? "w" : "b"
                    state.playerColor = randomColor
                } else {
                    state.playerColor = "w"
                }
            })
            .addCase(changeLevel, (state, action) => {
                const level = action.payload
                const playerColor = state.playerColor
                const botName = "bot-" + level
                const playerName = "player"
                if (playerColor === "w") {
                    state.players.black.name = botName
                    state.players.white.name = playerName
                } else {
                    state.players.white.name = botName
                    state.players.black.name = playerName
                }
            })
            .addCase(changeBotTimer, (state, action) => {
                const timerOption = action.payload

                state.timerOption = timerOption
            })
            .addCase(setup, onSetup)
            .addCase(sync, onSync)
    },
})

export const {
    timeOut,
    move,
    play,
    resign,
    select,
    updateTimings,
    rollback,
    correctTimers,
    undo,
    redo,
    undoToStart,
    redoToEnd,
} = gameSlice.actions

export default gameSlice.reducer
