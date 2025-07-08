import { pgTable, uuid, varchar , serial } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import {games} from './'

import {createdAt} from '@/utils/timestamps'

const moves = pgTable('moves', {
    moveNumber : serial().primaryKey(),
    gameId : uuid().references(()=>games.id),
    fen : varchar({length:100}),
    createdAt
});
export default moves


export const movesRelations = relations(moves, ({ }) => ({

})); 