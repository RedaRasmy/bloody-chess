import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"
import { Chess, Color, DEFAULT_POSITION,  Square } from "chess.js"
import { changeBotTimer, changeColor } from "../game-options"
import {
    getGameOverState,
} from "@/features/gameplay/utils/get-gameover-cause"
import {
    BoardElement,
    MoveType,
} from "@/features/gameplay/types"
import { initialCaputeredPieces } from "@/features/gameplay/utils/constantes"
import { oppositeColor } from "@/features/gameplay/utils/opposite-color"
import getInitialPieces from "@/features/gameplay/utils/get-pieces"
import updatePieces from "@/features/gameplay/utils/update-pieces"
import getLegalMoves from "@/features/gameplay/utils/get-legal-moves"
import updateCapturedPieces from "@/features/gameplay/utils/update-captured-pieces"
import safeMove from "@/features/gameplay/utils/safe-move"
import { GameState, Timings } from "./game-types"
import getExtraPoints from "@/features/gameplay/utils/get-extra-points"
import getDetailedMove from "@/features/gameplay/utils/get-detailed-move"
import { setup, sync } from "../multiplayer/multiplayer-slice"
import { getCapturedPieces } from "@/features/gameplay/utils/get-captured-pieces"
import getPieces from "@/features/gameplay/utils/get-pieces"
import { calculateTimeLeft } from "@/features/gameplay/utils/calculate-time-left"
import parseTimerOption from "@/features/gameplay/utils/parse-timer-option"
import * as reducers from './reducers'
import {onSync} from './extra-reducers'

const initialState:GameState = {
    fen: DEFAULT_POSITION,
    history: [],
    isCheck: false,
    currentTurn: "w" ,
    playerColor: "w" ,
    currentMoveIndex: -1,
    legalMoves: getLegalMoves(new Chess()),
    pieces: getInitialPieces(),
    activePiece: null ,
    timerOption: null ,
    players: {
        white: {
            name: "",
            timeLeft: null ,
            capturedPieces: initialCaputeredPieces.b ,
            extraPoints: 0,
        },
        black: {
            name: "",
            timeLeft: null ,
            capturedPieces: initialCaputeredPieces.w ,
            extraPoints: 0,
        },
    },
    gameOver: {
        isGameOver: false,
        winner: null,
        isDraw: false,
        reason: null,
    } ,
    newGame: false, // should change on new game // remove this later ?
    lastMoveAt: null ,
    gameStartedAt: null ,
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
        // timeOut,
        resign: (state) => {
            state.gameOver.reason = "Resignation"
            state.gameOver.isGameOver = true
            state.gameOver.winner = state.playerColor === "w" ? "b" : "w"
        },
        // play: (state) => ({
        //     ...initialState,
        //     // timerOption : state.timerOption ,
        //     playerColor: state.playerColor,
        //     isPlayerTurn: state.playerColor === "w",
        //     newGame: !state.newGame,
        //     timerOption : state.timerOption,
        //     players : {

        //     }
        // }),
        play: (state) => {
            const timerOption = state.timerOption
            const timer = timerOption
                ? parseTimerOption(timerOption)
                : { base: null }

            const base = timer.base ? timer.base * 1000 : timer.base
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
                        name: state.players.white.name,
                        extraPoints: 0,
                    },
                    black: {
                        capturedPieces: initialCaputeredPieces.w,
                        timeLeft: base,
                        name: state.players.black.name,
                        extraPoints: 0,
                    },
                },
            }
        },
        select: (state, action: PayloadAction<Exclude<BoardElement, null>>) => {
            const piece = action.payload
            state.activePiece = piece
        },
        move: (state, action: PayloadAction<MoveType>) => {
            if (
                state.gameOver.isGameOver ||
                state.currentMoveIndex < state.history.length - 1
            )
                return

            const move = action.payload
            const chess = new Chess()

            state.history.forEach((mv) => chess.move(mv))

            const validatedMove = safeMove(chess, move)

            if (!validatedMove) {
                return
            }
            const wtl = state.players.white.timeLeft
            const btl = state.players.black.timeLeft
            const gameStartedAt = state.gameStartedAt
            if (wtl !== null && btl !== null && gameStartedAt !== null) {

                const { whiteTimeLeft , blackTimeLeft} = calculateTimeLeft({
                    whiteTimeLeft : wtl ,
                    blackTimeLeft : btl,
                    currentTurn : state.currentTurn,
                    lastMoveAt: state.lastMoveAt
                        ? new Date(state.lastMoveAt)
                        : new Date(gameStartedAt),
                })
                state.players.white.timeLeft = whiteTimeLeft
                state.players.black.timeLeft = blackTimeLeft
            }

            const detailedMove = getDetailedMove(validatedMove, state.pieces)
            state.history.push({
                ...move,
                fenAfter: validatedMove.after,
            })

            // update pieces
            const newPieces = updatePieces(state.pieces, detailedMove)
            state.pieces = newPieces
            const { white, black } = getExtraPoints(newPieces)
            state.players.white.extraPoints = white.extraPoints
            state.players.black.extraPoints = black.extraPoints

            ////
            const { w, b } = updateCapturedPieces({
                captured: validatedMove.captured,
                capturedPieces: {
                    w: state.players.black.capturedPieces, // white capture black pieces
                    b: state.players.white.capturedPieces, // the opposite
                },
                movePlayer: validatedMove.color,
            })
            state.players.white.capturedPieces = b // white capture black pieces
            state.players.black.capturedPieces = w // the opposite
            ////

            // udpate fen
            state.fen = chess.fen()

            // i should delete this later ?
            if (state.currentTurn !== state.playerColor) {
                state.legalMoves = getLegalMoves(chess)
            }

            state.currentTurn = oppositeColor(state.currentTurn)

            state.isCheck = chess.isCheck()

            state.gameOver = getGameOverState(chess)

            state.currentMoveIndex = state.history.length - 1

            state.activePiece = null

            // update timing
            state.lastMoveAt = Date.now()
        },
    },
    extraReducers: (builder) => {
        builder.addCase(changeColor, (state, action) => {
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
        builder.addCase(changeBotTimer, (state, action) => {
            const timerOption = action.payload

            state.timerOption = timerOption
        })
        builder.addCase(setup, (state, action) => {
            const { game, playerId } = action.payload
            const whiteName = game.isForGuests
                ? game.white.displayName
                : game.white.username
            const blackName = game.isForGuests
                ? game.black.displayName
                : game.black.username
            const playerColor = game.whiteId === playerId ? "w" : "b"

            const capturedPieces = getCapturedPieces(game.moves)
            const pieces = getPieces(game.currentFen)
            const { white, black } = getExtraPoints(pieces)
            //

            state.timerOption = game.timer
            state.fen = game.currentFen
            state.history = game.moves.map((mv) => ({
                from: mv.from as Square,
                to: mv.to as Square,
                promotion: mv.promotion || undefined,
                fenAfter: mv.fenAfter,
            }))
            state.players = {
                white: {
                    name: whiteName,
                    timeLeft: game.whiteTimeLeft,
                    capturedPieces: capturedPieces.b,
                    extraPoints: white.extraPoints,
                },
                black: {
                    name: blackName,
                    timeLeft: game.blackTimeLeft,
                    capturedPieces: capturedPieces.w,
                    extraPoints: black.extraPoints,
                },
            }
            state.currentTurn = game.currentTurn
            state.legalMoves = getLegalMoves(new Chess(game.currentFen))
            state.pieces = pieces
            state.playerColor = playerColor
            state.currentTurn = game.currentTurn
        })
        builder.addCase(sync, onSync)
    },
})

export const { timeOut, move, play, resign, select, updateTimings } =
    gameSlice.actions

export default gameSlice.reducer
