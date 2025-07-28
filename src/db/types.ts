import { Prettify, SerializedTimestamps } from "@/utils/global-types"
import * as s from "./schema"
import { type InferSelectModel ,InferEnum } from "drizzle-orm"
import { Square } from "chess.js"
import { GameOverReason } from "@/features/gameplay/types"
import { History } from "@/redux/slices/game/game-types"

export type Player = SerializedTimestamps<InferSelectModel<typeof s.players>>
export type Game = SerializedTimestamps<InferSelectModel<typeof s.games>>
export type Guest = SerializedTimestamps<InferSelectModel<typeof s.guests>>
export type SMove = Prettify<
    SerializedTimestamps<InferSelectModel<typeof s.moves>> & {
        from: Square
        to: Square
    }
>

export type GameStatus = InferEnum<typeof s.statusEnum>

export type NewGame = Prettify<
    Game & {
        gameStartedAt: null
        blackId: null
        status: "matching"
        whiteReady: false
        blackReady: false
        result: null
        gameOverReason: null
    }
>

export type MatchedGame = Prettify<
    Game & {
        blackId: string
        status: "preparing"
        result: null
        gameOverReason: null
        whiteReady: false
        blackReady: false
    }
>
export type StartedGame = Prettify<
    Game & {
        blackId: string
        gameStartedAt: number
        status: "playing"
        result: null
        gameOverReason: null
        whiteReady: true
        blackReady: true
    }
>

export type FinishedGame = Prettify<
    Game & {
        blackId: string
        gameStartedAt: number
        status: "finished"
        result: "white_won" | "black_won" | "draw"
        gameOverReason: GameOverReason
        whiteReady: true
        blackReady: true
    }
>

export type FullGame = Prettify<
    ((MatchedGame | StartedGame | FinishedGame) & {
          whiteName: string
          blackName: string
          moves: History
      })
 
>
