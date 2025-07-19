import { integer, pgTable, uuid, varchar } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

import { timestamps } from "@/utils/timestamps"

const players = pgTable("players", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull(),
    username: varchar("username", { length: 30 }).notNull().unique(),
    elo: integer("elo").default(500).notNull(),
    gamesPlayed: integer("games_played").default(0).notNull(),
    wins: integer("wins").default(0).notNull(),
    losses: integer("losses").default(0).notNull(),
    draws: integer("draws").default(0).notNull(),
    ...timestamps,
})
export default players

export const playersRelations = relations(players, ({}) => ({}))


