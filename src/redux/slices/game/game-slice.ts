import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice, createSelector } from "@reduxjs/toolkit"
import { Chess, Color, DEFAULT_POSITION, Move, Square } from "chess.js"
import { RootState } from "../../store"
import { changeBotTimer, changeColor } from "../game-options"
import {
    getGameoverCause,
    getGameOverState,
} from "@/features/gameplay/utils/get-gameover-cause"
import {
    BoardElement,
    CapturedPieces,
    DetailedMove,
    GameOverReason,
    MoveType,
    History,
} from "@/features/gameplay/types"
import { initialCaputeredPieces } from "@/features/gameplay/utils/constantes"
import { oppositeColor } from "@/features/gameplay/utils/opposite-color"
import getInitialPieces from "@/features/gameplay/utils/get-pieces"
import updatePieces from "@/features/gameplay/utils/update-pieces"
import getLegalMoves from "@/features/gameplay/utils/get-legal-moves"
import updateCapturedPieces from "@/features/gameplay/utils/update-captured-pieces"
import safeMove from "@/features/gameplay/utils/safe-move"
import { GameOverState } from "./game-types"
import { ChessTimerOption } from "@/features/gameplay/types"
import getExtraPoints from "@/features/gameplay/utils/get-extra-points"
import getDetailedMove from "@/features/gameplay/utils/get-detailed-move"
import { setup, sync } from "../multiplayer/multiplayer-slice"
import { getCapturedPieces } from "@/features/gameplay/utils/get-captured-pieces"
import getPieces from "@/features/gameplay/utils/get-pieces"
import { calculateTimeLeft } from "@/features/gameplay/utils/calculate-time-left"
import parseTimerOption from "@/features/gameplay/utils/parse-timer-option"

const initialState = {
    fen: DEFAULT_POSITION,
    history: [] as History,
    isCheck: false,
    currentTurn: "w" as Color,
    playerColor: "w" as Color,
    currentMoveIndex: -1,
    legalMoves: getLegalMoves(new Chess()),
    pieces: getInitialPieces(),
    activePiece: null as BoardElement,
    timerOption: null as ChessTimerOption | null,
    players: {
        white: {
            name: "guest",
            timeLeft: null as null | number,
            capturedPieces: initialCaputeredPieces.b as CapturedPieces["w"],
            extraPoints: 0,
        },
        black: {
            name: "bot",
            timeLeft: null as null | number,
            capturedPieces: initialCaputeredPieces.w as CapturedPieces["b"],
            extraPoints: 0,
        },
    },
    gameOver: {
        isGameOver: false,
        winner: null,
        isDraw: false,
        reason: null,
    } as GameOverState,
    newGame: false, // should change on new game
}

const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
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
        // },
        timeOut: (state) => {
            state.gameOver.reason = "Timeout"
            state.gameOver.isGameOver = true
            state.gameOver.winner = oppositeColor(state.currentTurn)
        },
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

            return {
                ...initialState,
                playerColor: state.playerColor,
                isPlayerTurn: state.playerColor === "w",
                newGame: !state.newGame,
                timerOption: state.timerOption,
                players : {
                    white : {
                        capturedPieces : initialCaputeredPieces.w,
                        timeLeft : timer.base,
                        name : state.players.white.name,
                        extraPoints : 0
                    },
                    black : {
                        capturedPieces : initialCaputeredPieces.w,
                        timeLeft : timer.base,
                        name : state.players.black.name,
                        extraPoints : 0
                    },
                }
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
                    w: state.players.white.capturedPieces,
                    b: state.players.black.capturedPieces,
                },
                movePlayer: validatedMove.color,
            })
            state.players.white.capturedPieces = w
            state.players.black.capturedPieces = b
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
        builder.addCase(sync, (state, action) => {
            const game = action.payload
            const chess = new Chess(game.currentFen)

            const { white, black } = calculateTimeLeft({
                whiteTimeLeft: game.whiteTimeLeft,
                blackTimeLeft: game.blackTimeLeft,
                currentTurn: game.currentTurn,
                lastMoveAt: game.lastMoveAt || game.gameStartedAt || new Date(),
            })

            state.fen = game.currentFen
            state.players.white.timeLeft = white
            state.players.black.timeLeft = black
            state.currentTurn = game.currentTurn
            state.gameOver = getGameOverState(chess)
            state.currentTurn = game.currentTurn
            state.legalMoves = getLegalMoves(chess)
            state.pieces = getPieces(game.currentFen)
        })
    },
})

export const { timeOut, move, play, resign, select } = gameSlice.actions

export default gameSlice.reducer
