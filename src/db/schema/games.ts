import { pgTable, uuid, pgEnum, boolean, text ,integer , bigint } from "drizzle-orm/pg-core"
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
    "matching",
    "preparing",
    "playing",
    "finished",
])
export const timerOptionsEnum = pgEnum("timer_option", TIMER_OPTIONS)
export const gameOverReasonsEnum = pgEnum("gameover_reason", GAMEOVER_REASONS)

const games = pgTable("games", {
    id: uuid().primaryKey().defaultRandom(),
    whiteId: uuid("white_id").notNull(),
    blackId: uuid("black_id"),
    isForGuests: boolean("is_for_guests").notNull(),
    currentFen: text("current_fen").default(DEFAULT_POSITION).notNull(),
    result: resultEnum(),
    gameOverReason: gameOverReasonsEnum("gameover_reason"),
    status: statusEnum().default("matching").notNull(),
    timer: timerOptionsEnum().notNull(),
    currentTurn: colorsEnum("current_turn").default('w').notNull(),
    whiteTimeLeft: integer('white_time_left').notNull(), 
    blackTimeLeft: integer("black_time_left").notNull(), 
    lastMoveAt: bigint('last_move_at', { mode: 'number' }), 
    gameStartedAt : bigint('game_started_at', { mode: 'number' }),
    whiteReady : boolean("white_ready").default(false).notNull(),
    blackReady : boolean("black_ready").default(false).notNull(),
    ...timestamps,
})
export default games

export const gamesRelations = relations(games, ({many}) => ({
    moves : many(moves)
}))
