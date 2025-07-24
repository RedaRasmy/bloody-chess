import { oppositeColor } from "@/features/gameplay/utils/opposite-color"
import { WritableDraft } from "immer"
import { GameState } from "../game-types"

export const timeOut = (state: WritableDraft<GameState>) => {
    // Only allow timeout if the game is not already over
    if (!state.gameOver.isGameOver) {
        state.gameOver = {
            isGameOver: true,
            reason: "Timeout",
            winner: oppositeColor(state.currentTurn),
            isDraw: false,
        }

        // Stop all timers by setting current time
        const now = Date.now()
        if (
            state.currentTurn === "w" &&
            state.players.white.timeLeft !== null
        ) {
            state.players.white.timeLeft = 0
        } else if (
            state.currentTurn === "b" &&
            state.players.black.timeLeft !== null
        ) {
            state.players.black.timeLeft = 0
        }
        // state.lastMoveAt = now
    }
}
