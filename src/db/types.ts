import * as s from "./schema"
import {  type InferSelectModel } from "drizzle-orm"

export type Player = InferSelectModel<typeof s.players>
export type Game = InferSelectModel<typeof s.games>
export type Guest = InferSelectModel<typeof s.guests>
export type SMove = InferSelectModel<typeof s.moves>