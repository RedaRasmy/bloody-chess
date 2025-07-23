import { DrawReason, WinReason } from "@/features/gameplay/types"
import { Color } from "chess.js"

export type GameOverState = {
    isGameOver : true,
    winner : Color,
    isDraw : false
    reason : WinReason
} | {
    isGameOver : true,
    winner : null
    isDraw : true
    reason : DrawReason
} | {
    isGameOver : false
    winner : null
    isDraw : false
    reason : null
}

export type Timings = {
    whiteTimeLeft : number | null
    blackTimeLeft : number | null
    gameStartedAt : number | null
    lastMoveAt : number | null
}