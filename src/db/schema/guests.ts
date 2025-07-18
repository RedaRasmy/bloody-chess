import {  pgTable, uuid , varchar} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

import { timestamps } from "@/utils/timestamps"

const guests = pgTable("guests", {
    id: uuid().defaultRandom().primaryKey(),
    displayName : varchar("display_name",{length:30}).notNull(),
    ...timestamps,
})
export default guests

export const guestsRelations = relations(guests, ({ }) => ({

}))