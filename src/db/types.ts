import { Prettify } from "@/utils/global-types"
import * as s from "./schema"
import { type InferSelectModel } from "drizzle-orm"

export type Player = InferSelectModel<typeof s.players>
export type Game = InferSelectModel<typeof s.games>
export type Guest = InferSelectModel<typeof s.guests>
export type SMove = InferSelectModel<typeof s.moves>



export type FullGame = Prettify<
    | (Game & {
          isForGuests: false
          white: Player
          black: Player
          moves: SMove[]
      })
    | (Game & {
          isForGuests: true
          white: Guest
          black: Guest
          moves: SMove[]
      })
>
