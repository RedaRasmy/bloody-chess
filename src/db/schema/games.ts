import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import {players} from './'

import {timestamps} from '@/utils/timestamps'

const games = pgTable('games', {
    id: uuid().primaryKey().defaultRandom(),
    whiteId : uuid().references(()=>players.id),
    blackId : uuid().references(()=>players.id),
    result : varchar({length:50}),
    status : varchar({length:50}),
    timer : varchar({length: 50}),
    ...timestamps
});
export default games

export const gamesRelations = relations(games, ({ }) => ({

})); 