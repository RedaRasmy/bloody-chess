import { Prettify } from "@/utils/global-types"
import * as s from "./schema"
import { type InferSelectModel } from "drizzle-orm"

export type Player = InferSelectModel<typeof s.players>
export type Game = InferSelectModel<typeof s.games>
export type Guest = InferSelectModel<typeof s.guests>
export type SMove = InferSelectModel<typeof s.moves>

export type StartedGame = Prettify<
    Omit<Game, "createdAt" | "updatedAt"> & {
        whiteId: string
        blackId: string
        gameStartedAt: number
        createdAt: number
        updatedAt: number
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
