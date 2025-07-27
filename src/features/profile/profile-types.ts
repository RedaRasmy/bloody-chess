import { Color } from "chess.js"
import { ChessTimerOption } from "../gameplay/types"

export type PlayedGame = {
    id : string
    color : Color,
    result : 'win' | 'lose' | "draw",
    timerOption : ChessTimerOption
}