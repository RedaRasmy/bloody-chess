import { WritableDraft } from "immer"
import { GameState } from "../game-types"
import { MoveType } from "@/features/gameplay/types"
import { PayloadAction } from "@reduxjs/toolkit"
import { Chess } from "chess.js"
// import safeMove from "@/features/gameplay/utils/safe-move"
import { calculateTimeLeft } from "@/features/gameplay/utils/calculate-time-left"
import getDetailedMove from "@/features/gameplay/utils/get-detailed-move"
import updatePieces from "@/features/gameplay/utils/update-pieces"
import getExtraPoints from "@/features/gameplay/utils/get-extra-points"
import updateCapturedPieces from "@/features/gameplay/utils/update-captured-pieces"
import getLegalMoves from "@/features/gameplay/utils/get-legal-moves"
import { oppositeColor } from "@/features/gameplay/utils/opposite-color"
import { getGameOverState } from "@/features/gameplay/utils/get-gameover-cause"
import parseTimerOption from "@/features/gameplay/utils/parse-timer-option"

export function move(
    state: WritableDraft<GameState>,
    action: PayloadAction<MoveType>
) {
    if (state.gameOver.isGameOver) {
        console.log("cant move , game is over!")
        return
    }
    if (state.currentMoveIndex < state.history.length - 1) {
        console.log("cant move while undo !")
        return
    }
    const move = action.payload
    const chess = new Chess()
    state.history.forEach((mv) =>
        chess.move({
            from: mv.from,
            to: mv.to,
            promotion: mv.promotion,
        })
    )

    const validatedMove = chess.move(move)
    // const validatedMove = safeMove(chess, move)
    // if (!validatedMove) {
    //     return
    // }
    const playerColor = validatedMove.color

    const { plus } = state.timerOption
        ? parseTimerOption(state.timerOption)
        : { plus: 0 }

    const wtl = state.players.white.timeLeft
    const btl = state.players.black.timeLeft
    const gameStartedAt = state.gameStartedAt
    if (wtl !== null && btl !== null && gameStartedAt !== null) {
        const { whiteTimeLeft, blackTimeLeft } = calculateTimeLeft({
            whiteTimeLeft: playerColor === "w" ? wtl + plus : wtl,
            blackTimeLeft: playerColor === "b" ? btl + plus : btl,
            currentTurn: state.currentTurn,
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
    const { whiteExtraPoints, blackExtraPoints } = getExtraPoints(newPieces)
    state.players.white.extraPoints = whiteExtraPoints
    state.players.black.extraPoints = blackExtraPoints

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

    if (validatedMove.color === state.playerColor) {
        // reset active piece only if Im the move player
        // to allow preemptive moves : ( drag [in opp turn] and drop [in your turn ])
        state.activePiece = null
    }
    state.currentTurn = oppositeColor(state.currentTurn)

    state.isCheck = chess.isCheck()

    state.gameOver = getGameOverState(chess)

    state.currentMoveIndex = state.history.length - 1

    // update timing
    state.lastMoveAt = Date.now()
}
