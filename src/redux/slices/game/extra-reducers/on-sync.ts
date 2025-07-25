import { StartedGame } from "@/db/types"
import { calculateTimeLeft } from "@/features/gameplay/utils/calculate-time-left"
// import { getGameOverState } from "@/features/gameplay/utils/get-gameover-cause"
// import getLegalMoves from "@/features/gameplay/utils/get-legal-moves"
// import getPieces from "@/features/gameplay/utils/get-pieces"
import { PayloadAction } from "@reduxjs/toolkit"
// import { Chess } from "chess.js"
import { GameState } from "../game-types"
import { WritableDraft } from "immer"

export const onSync = (
    state: WritableDraft<GameState>,
    action: PayloadAction<StartedGame>
) => {
    const game = action.payload
    // const chess = new Chess(game.currentFen)

    // Only update timers if game is active
    if (game.gameStartedAt && !state.gameOver.isGameOver) {
        const { whiteTimeLeft, blackTimeLeft } = calculateTimeLeft({
            whiteTimeLeft: game.whiteTimeLeft,
            blackTimeLeft: game.blackTimeLeft,
            currentTurn: game.currentTurn,
            lastMoveAt: game.lastMoveAt
                ? new Date(game.lastMoveAt)
                : new Date(game.gameStartedAt),
        })

        // Only update if times are positive and game is not over
        if (whiteTimeLeft >= 0 && blackTimeLeft >= 0) {
            state.players.white.timeLeft = whiteTimeLeft
            state.players.black.timeLeft = blackTimeLeft
        }
    }

    // console.log('-- sync : new fen : ',game.currentFen)
    // console.log('-- sync : new turn : ',game.currentTurn)
    // state.fen = game.currentFen
    // state.currentTurn = game.currentTurn

    // // Check for game over states
    // const gameOverState = getGameOverState(chess)
    // if (!state.gameOver.isGameOver) {
    //     state.gameOver = gameOverState
    // }

    // state.legalMoves = getLegalMoves(chess)
    // // state.pieces = getPieces(game.currentFen)
    state.lastMoveAt = game.lastMoveAt
}
