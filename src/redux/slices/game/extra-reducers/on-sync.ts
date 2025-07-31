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

    // Only update timers if game is active
    // if (game.gameStartedAt && !state.gameOver.isGameOver) {
    //     const { whiteTimeLeft, blackTimeLeft } = calculateTimeLeft({
    //         whiteTimeLeft: game.whiteTimeLeft,
    //         blackTimeLeft: game.blackTimeLeft,
    //         currentTurn: game.currentTurn,
    //         lastMoveAt: game.lastMoveAt
    //             ? new Date(game.lastMoveAt)
    //             : new Date(game.gameStartedAt),
    //     })

    //     console.log(
    //         "sync timings : white diff (ms) = ",
    //         game.whiteTimeLeft - whiteTimeLeft
    //     )
    //     console.log(
    //         "sync timings : black diff (ms) = ",
    //         game.blackTimeLeft - blackTimeLeft
    //     )
    //     // Only update if times are positive and game is not over
    //     if (whiteTimeLeft >= 0 && blackTimeLeft >= 0) {
    //         state.players.white.timeLeft = whiteTimeLeft
    //         state.players.black.timeLeft = blackTimeLeft
    //     }
    // }
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
    // TODO: draw by agreement
}
