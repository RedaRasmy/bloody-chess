import {  text, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

import {timestamps} from '@/utils/timestamps'

const users = pgTable('users', {
    id: uuid().primaryKey().defaultRandom(),
    name: varchar({length:255}).notNull(),
    email: varchar({length:320}).notNull().unique(),
    password: text().notNull(),
    ...timestamps
});
export default users


export const usersRelations = relations(users, ({ }) => ({

})); 