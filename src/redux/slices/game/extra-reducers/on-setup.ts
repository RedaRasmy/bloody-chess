import { FullGame } from "@/db/types"
import { PayloadAction } from "@reduxjs/toolkit"
import { GameState } from "../game-types"
import { WritableDraft } from "immer"
import { getCapturedPieces } from "@/features/gameplay/utils/get-captured-pieces"
import getPieces from "@/features/gameplay/utils/get-pieces"
import getExtraPoints from "@/features/gameplay/utils/get-extra-points"
import { Chess, Square } from "chess.js"
import getLegalMoves from "@/features/gameplay/utils/get-legal-moves"
import { DrawReason, WinReason } from "@/features/gameplay/types"
// import { calculateTimeLeft } from "@/features/gameplay/utils/calculate-time-left"

export function onSetup(
    state: WritableDraft<GameState>,
    action: PayloadAction<{ game: FullGame; playerId: string }>
) {
    const { game, playerId } = action.payload
    const playerColor = game.whiteId === playerId ? "w" : "b"

    const capturedPieces = getCapturedPieces(game.moves)
    const pieces = getPieces(game.currentFen)
    const { whiteExtraPoints, blackExtraPoints } = getExtraPoints(pieces)
    //

    state.timerOption = game.timer
    state.fen = game.currentFen
    state.history = game.moves.map((mv) => ({
        from: mv.from as Square,
        to: mv.to as Square,
        promotion: mv.promotion || undefined,
        fenAfter: mv.fenAfter, // TODO
    }))

    
    // Only update timers if game is active
    // const lastMoveAt = game.lastMoveAt || game.gameStartedAt

    // const { whiteTimeLeft , blackTimeLeft } = lastMoveAt
    //     ? calculateTimeLeft({
    //           whiteTimeLeft: game.whiteTimeLeft,
    //           blackTimeLeft: game.blackTimeLeft,
    //           currentTurn: game.currentTurn,
    //           lastMoveAt: new Date(lastMoveAt),
    //       })
    //     : {
    //           whiteTimeLeft: game.whiteTimeLeft,
    //           blackTimeLeft: game.blackTimeLeft,
    //       }
    
    state.gameStartedAt = game.gameStartedAt
    state.lastMoveAt = game.lastMoveAt

    state.players = {
        white: {
            name: game.whiteName,
            timeLeft: game.whiteTimeLeft,
            capturedPieces: capturedPieces.b,
            extraPoints: whiteExtraPoints,
        },
        black: {
            name: game.blackName,
            timeLeft: game.blackTimeLeft,
            capturedPieces: capturedPieces.w,
            extraPoints: blackExtraPoints,
        },
    }
    state.currentTurn = game.currentTurn
    state.legalMoves = getLegalMoves(new Chess(game.currentFen))
    state.pieces = pieces
    state.playerColor = playerColor
    state.currentTurn = game.currentTurn
    state.activePiece = null
    state.currentMoveIndex = game.moves.length - 1

    // set game over states
    if (game.status === "finished") {
        if (game.result === "draw") {
            state.gameOver = {
                isGameOver: true,
                isDraw: true,
                winner: null,
                reason: game.gameOverReason as DrawReason,
            }
        } else {
            state.gameOver = {
                isGameOver: true,
                isDraw: false,
                winner: game.result === "white_won" ? "w" : "b",
                reason: game.gameOverReason as WinReason,
            }
        }
    } else {
        state.gameOver = {
            isGameOver: false,
            isDraw: false,
            winner: null,
            reason: null,
        }
    }
}
