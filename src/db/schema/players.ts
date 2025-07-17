import { integer, pgTable, uuid, varchar } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

import { timestamps } from "@/utils/timestamps"

const players = pgTable("players", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
        .notNull()
        .references(() => authUsers.id, { onDelete: "cascade" }),
    username: varchar("username", { length: 50 }).notNull().unique(),
    elo: integer("elo").default(1200).notNull(),
    gamesPlayed: integer("games_played").default(0).notNull(),
    wins: integer("wins").default(0).notNull(),
    losses: integer("losses").default(0).notNull(),
    draws: integer("draws").default(0).notNull(),
    ...timestamps,
})
export default players

export const authUsers = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: varchar('email').notNull(),
  // ... other auth fields (you don't manage these)
}, (table) => ({
  // This table exists in 'auth' schema, not 'public'
  schemaName: 'auth'
}))

// Relations (optional but helpful)
export const playersRelations = relations(players, ({ one }) => ({
  user: one(authUsers, {
    fields: [players.userId],
    references: [authUsers.id],
  }),
}))
