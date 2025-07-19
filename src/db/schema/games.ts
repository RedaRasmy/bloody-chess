import { pgTable, uuid ,pgEnum , boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

import {timestamps} from '@/utils/timestamps'
import { GAMEOVER_REASONS, TIMER_OPTIONS } from '@/features/gameplay/utils/constantes';

export const resultEnum = pgEnum("result",[
    'draw', 'white_won' , 'black_won'
])
export const statusEnum = pgEnum("status",[
    'not-started', 'playing' , 'finished'
])
export const timerOptionsEnum = pgEnum("timer_option",TIMER_OPTIONS)
export const gameOverReasonsEnum = pgEnum('gameover_reason',GAMEOVER_REASONS)


const games = pgTable('games', {
    id: uuid().primaryKey().defaultRandom(),
    whiteId : uuid('white_id'),
    blackId : uuid('black_id'),
    isForGuests : boolean('for_guests').notNull(),
    result : resultEnum(),
    gameOverReason : gameOverReasonsEnum(),
    status : statusEnum().default("not-started").notNull(),
    timer : timerOptionsEnum().notNull(),
    ...timestamps
});
export default games

export const gamesRelations = relations(games, ({ }) => ({
    
}));