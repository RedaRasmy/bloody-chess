'use server'

import {db} from '@/db/drizzle'

export default async function getNewGame() {
    const newGame = await db.query.games.findFirst({
        where : (games,{eq}) => eq(games.status,'not-started'),
        orderBy : (games,{asc}) => [asc(games.createdAt)]
    })

    return newGame
}