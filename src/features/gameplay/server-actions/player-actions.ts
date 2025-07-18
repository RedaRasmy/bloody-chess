'use server'

import {db} from '@/db/drizzle'

export async function getPlayer(id:string) {
    const player = await db.query.players.findFirst({
        where : (players,{eq}) => eq(players.id , id)
    })
    return player
}

