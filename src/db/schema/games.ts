import { pgTable, uuid, pgEnum, boolean, text ,integer , timestamp } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

import { timestamps } from "@/utils/timestamps"
import {
    GAMEOVER_REASONS,
    TIMER_OPTIONS,
} from "@/features/gameplay/utils/constantes"
import { DEFAULT_POSITION } from "chess.js"
import moves, { colorsEnum } from "./moves"

export const resultEnum = pgEnum("result", ["draw", "white_won", "black_won"])
export const statusEnum = pgEnum("status", [
    "not-started",
    "playing",
    "finished",
])
export const timerOptionsEnum = pgEnum("timer_option", TIMER_OPTIONS)
export const gameOverReasonsEnum = pgEnum("gameover_reason", GAMEOVER_REASONS)

const games = pgTable("games", {
    id: uuid().primaryKey().defaultRandom(),
    whiteId: uuid("white_id"),
    blackId: uuid("black_id"),
    isForGuests: boolean("for_guests").notNull(),
    currentFen: text("current_fen").default(DEFAULT_POSITION).notNull(),
    result: resultEnum(),
    gameOverReason: gameOverReasonsEnum("gameover_reason"),
    status: statusEnum().default("not-started").notNull(),
    timer: timerOptionsEnum().notNull(),
    currentTurn: colorsEnum("current_turn").notNull(),
    whiteTimeLeft: integer('white_time_left').notNull(), 
    blackTimeLeft: integer("black_time_left").notNull(), 
    lastMoveAt: timestamp("last_move_at"), 
    ...timestamps,
})
export default games

export const gamesRelations = relations(games, ({many}) => ({
    moves : many(moves)
}))
