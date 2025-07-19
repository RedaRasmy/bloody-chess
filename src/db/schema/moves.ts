import {
    pgTable,
    uuid,
    varchar,
    integer,
    pgEnum,
    boolean,
    text
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { games } from "./"

import { createdAt } from "@/utils/timestamps"

export const promotionsEnum = pgEnum("promotion_piece", ["q", "r", "n", "b"])
export const colorsEnum = pgEnum("color", ["w", "b"])
export const piecesEnum = pgEnum("piece", ["q", "r", "n", "b",'k'])

const moves = pgTable("moves", {
    id: uuid().primaryKey().defaultRandom(),
    moveNumber: integer("move_number").notNull(),
    fenAfter: text('fen_after').notNull(),
    gameId: uuid("game_id").references(() => games.id),
    from: varchar({ length: 2 }).notNull(),
    to: varchar({ length: 2 }).notNull(),
    promotion: promotionsEnum(),
    playerId: uuid("player_id").notNull(),
    playerColor: colorsEnum("player_color").notNull(),
    piece : piecesEnum().notNull(),
    isCapture: boolean("is_capture").default(false),
    isCheck: boolean("is_check").default(false),
    isCheckmate: boolean("is_checkmate").default(false),
    moveTime: integer("move_time").notNull(),
    san: varchar({length: 10}).notNull(),
    createdAt,
})

export default moves

export const movesRelations = relations(moves, ({}) => ({}))
