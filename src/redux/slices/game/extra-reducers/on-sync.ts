import { StartedGame } from "@/db/types"
import { calculateTimeLeft } from "@/features/gameplay/utils/calculate-time-left"
import { PayloadAction } from "@reduxjs/toolkit"
import { GameState } from "../game-types"
import { WritableDraft } from "immer"

export const onSync = (
    state: WritableDraft<GameState>,
    action: PayloadAction<StartedGame>
) => {
    const game = action.payload

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

        console.log('sync timings : white diff (ms) = ',game.whiteTimeLeft - whiteTimeLeft )
        console.log('sync timings : black diff (ms) = ',game.blackTimeLeft - blackTimeLeft )
        // Only update if times are positive and game is not over
        if (whiteTimeLeft >= 0 && blackTimeLeft >= 0) {
            state.players.white.timeLeft = whiteTimeLeft
            state.players.black.timeLeft = blackTimeLeft
        }
    }
    state.gameStartedAt = game.gameStartedAt
    state.lastMoveAt = game.lastMoveAt

}
