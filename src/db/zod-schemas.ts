import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { users } from "./schema"

export const insertUserSchema = createInsertSchema(users).omit({
    createdAt: true,
    updatedAt : true,
    id: true,
})
export const selectUserSchema = createSelectSchema(users)