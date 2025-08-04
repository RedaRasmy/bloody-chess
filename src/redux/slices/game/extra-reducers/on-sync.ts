import { FinishedGame, StartedGame } from "@/db/types"
// import { calculateTimeLeft } from "@/features/gameplay/utils/calculate-time-left"
import { PayloadAction } from "@reduxjs/toolkit"
import { GameState } from "../game-types"
import { WritableDraft } from "immer"
import { oppositeColor } from "@/features/gameplay/utils/opposite-color"
// import { calculateTimeLeft } from "@/features/gameplay/utils/calculate-time-left"

export const onSync = (
    state: WritableDraft<GameState>,
    action: PayloadAction<StartedGame | FinishedGame>
) => {
    const game = action.payload

    console.log('sync -- the new game data to sync with : ',game)

    state.players.white.timeLeft = game.whiteTimeLeft
    state.players.black.timeLeft = game.blackTimeLeft
    state.gameStartedAt = game.gameStartedAt
    state.lastMoveAt = game.lastMoveAt

    // handle special gameOver reasons (no by-move ones)
    console.log('on-sync -- received gameover reason :',game.gameOverReason)
    if (game.gameOverReason === "Resignation") {
        const winner = game.result === "white_won" ? "w" : "b"
        state.gameOver.isGameOver = true
        state.gameOver.reason = "Resignation"
        state.gameOver.winner = winner
        console.log('gameover state changde : resignation')
    }
    if (game.gameOverReason === "Timeout") {
        state.gameOver.isGameOver = true
        state.gameOver.reason = "Timeout"
        state.gameOver.winner = oppositeColor(game.currentTurn)
    }
    if (game.gameOverReason === "Agreement") {
        state.gameOver.isGameOver = true
        state.gameOver.reason = "Agreement"
        state.gameOver.isDraw = true
        state.gameOver.winner = null
    }
}
