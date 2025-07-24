import { Prettify, SerializedTimestamps } from "@/utils/global-types"
import * as s from "./schema"
import { type InferSelectModel } from "drizzle-orm"
import { Square } from "chess.js"

export type Player = SerializedTimestamps<InferSelectModel<typeof s.players>>
export type Game = SerializedTimestamps<InferSelectModel<typeof s.games>>
export type Guest = SerializedTimestamps<InferSelectModel<typeof s.guests>>
export type SMove = Prettify<SerializedTimestamps<InferSelectModel<typeof s.moves>> & {
    from : Square
    to : Square
}>



export type StartedGame = Prettify<
    Game & {
        whiteId: string
        blackId: string
        gameStartedAt : number
    }
>

export type FullGame = Prettify<
    | (StartedGame & {
          isForGuests: false
          white: Player
          black: Player
          moves: SMove[]
      })
    | (StartedGame & {
          isForGuests: true
          white: Guest
          black: Guest
          moves: SMove[]
      })
>
