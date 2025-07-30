import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"
import { Chess, Color, DEFAULT_POSITION } from "chess.js"
import { changeBotTimer, changeColor, changeLevel } from "../game-options"
import { BoardElement } from "@/features/gameplay/types"
import { initialCaputeredPieces } from "@/features/gameplay/utils/constantes"
import getInitialPieces from "@/features/gameplay/utils/get-pieces"
import getLegalMoves from "@/features/gameplay/utils/get-legal-moves"
import { GameState, Timings } from "./game-types"
import { setup, sync } from "../multiplayer/multiplayer-slice"
import parseTimerOption from "@/features/gameplay/utils/parse-timer-option"
import * as reducers from "./reducers"
import { onSync, onSetup } from "./extra-reducers"
import { oppositeColor } from "@/features/gameplay/utils/opposite-color"
import { calculateTimeLeft } from "@/features/gameplay/utils/calculate-time-left"

const initialState: GameState = {
    fen: DEFAULT_POSITION,
    history: [],
    isCheck: false,
    currentTurn: "w",
    playerColor: "w",
    currentMoveIndex: -1,
    legalMoves: getLegalMoves(new Chess()),
    pieces: getInitialPieces(),
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
        // undo: (state) => {
        //     state.pieces = updatePieces(
        //         state.pieces,
        //         state.history[state.currentMoveIndex],
        //         true
        //     )
        //     state.currentMoveIndex--
        // },
        // redo: (state) => {
        //     state.currentMoveIndex++
        //     state.pieces = updatePieces(
        //         state.pieces,
        //         state.history[state.currentMoveIndex]
        //     )
        // }
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
                console.log('correctTimers reducer runs...')
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
} = gameSlice.actions

export default gameSlice.reducer
