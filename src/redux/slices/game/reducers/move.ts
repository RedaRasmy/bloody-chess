import { WritableDraft } from "immer"
import { GameState } from "../game-types"
import { MoveType } from "@/features/gameplay/types"
import { PayloadAction } from "@reduxjs/toolkit"
import { Chess } from "chess.js"
import getDetailedMove from "@/features/gameplay/utils/get-detailed-move"
import updatePieces from "@/features/gameplay/utils/update-pieces"
import getExtraPoints from "@/features/gameplay/utils/get-extra-points"
import updateCapturedPieces from "@/features/gameplay/utils/update-captured-pieces"
import getLegalMoves from "@/features/gameplay/utils/get-legal-moves"
import { oppositeColor } from "@/features/gameplay/utils/opposite-color"
import { getGameOverState } from "@/features/gameplay/utils/get-gameover-cause"
import { calculateTimeLeft } from "@/features/gameplay/utils/calculate-time-left"
import parseTimerOption from "@/features/gameplay/utils/parse-timer-option"
import {redoToEnd} from './'

export function move(
    state: WritableDraft<GameState>,
    action: PayloadAction<MoveType>
) {
    if (state.gameOver.isGameOver) {
        console.log("Move Reducer : cant move , game is over!")
        return
    }
    if (!state.gameStartedAt || state.gameStartedAt > Date.now()) {
        console.log("Move Reducer : cant move , game is not started yet")
        return
    }
    if (state.currentMoveIndex < state.history.length - 1) {
        redoToEnd(state)
    }

    const move = action.payload
    const chess = new Chess()

    // Replay all moves to get current position
    state.history.forEach((mv) =>
        chess.move({
            from: mv.from,
            to: mv.to,
            promotion: mv.promotion,
        })
    )

    const validatedMove = chess.move(move)

    if (
        state.players.white.timeLeft !== null &&
        state.players.black.timeLeft !== null &&
        state.gameStartedAt
    ) {
        const { whiteTimeLeft, blackTimeLeft } = calculateTimeLeft({
            whiteTimeLeft: state.players.white.timeLeft,
            blackTimeLeft: state.players.black.timeLeft,
            currentTurn: state.currentTurn,
            lastMoveAt: state.lastMoveAt
                ? new Date(state.lastMoveAt)
                : new Date(state.gameStartedAt),
        })
        // Apply calculated times
        const { plus } = state.timerOption
            ? parseTimerOption(state.timerOption)
            : { plus: 0 }
        state.players.white.timeLeft =
            whiteTimeLeft + (validatedMove.color === "w" ? plus * 1000 : 0)
        state.players.black.timeLeft =
            blackTimeLeft + (validatedMove.color === "b" ? plus * 1000 : 0)
    }

    const detailedMove = getDetailedMove(validatedMove, state.pieces)
    state.history.push({
        ...move,
        fenAfter: validatedMove.after,
    })

    // update pieces
    const newPieces = updatePieces(state.pieces, detailedMove)
    state.pieces = newPieces
    const { whiteExtraPoints, blackExtraPoints } = getExtraPoints(newPieces)
    state.players.white.extraPoints = whiteExtraPoints
    state.players.black.extraPoints = blackExtraPoints

    ////
    const { w: whiteCapturedPieces, b: blackCapturedPieces } =
        updateCapturedPieces({
            captured: validatedMove.captured,
            capturedPieces: {
                w: state.players.black.capturedPieces, // white captures black pieces
                b: state.players.white.capturedPieces, // the opposite
            },
            movePlayer: validatedMove.color,
        })
    state.players.white.capturedPieces = blackCapturedPieces // white captures black pieces
    state.players.black.capturedPieces = whiteCapturedPieces // black captures white pieces
    ////

    // udpate fen
    state.fen = chess.fen()

    // i should delete this later ?
    if (state.currentTurn !== state.playerColor) {
        state.legalMoves = getLegalMoves(chess)
    }

    if (validatedMove.color === state.playerColor) {
        // reset active piece only if Im the move player
        // to allow preemptive moves : ( drag [in opp turn] and drop [in your turn])
        state.activePiece = null
    }
    state.currentTurn = oppositeColor(state.currentTurn)

    state.gameOver = getGameOverState(chess)

    state.currentMoveIndex = state.history.length - 1

    // update timing
    state.lastMoveAt = Date.now()
}
