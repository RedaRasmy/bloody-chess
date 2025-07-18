import { pgTable, uuid, varchar , integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import {games} from './'

import {createdAt} from '@/utils/timestamps'

const moves = pgTable('moves', {
    id : uuid().primaryKey(),
    moveNumber : integer("move_number").notNull(),
    gameId : uuid('game_id').references(()=>games.id),
    fen : varchar({length:100}),
    createdAt
});
export default moves


export const movesRelations = relations(moves, ({ }) => ({

})); 