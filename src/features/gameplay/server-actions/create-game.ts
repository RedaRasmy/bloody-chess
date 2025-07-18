'use server'

import {db} from '@/db/drizzle'
import {games} from '@/db/schema'
import {ChessTimerOption} from '@/features/gameplay/types'

export default async function createGame({
    isForGuests,timer,playerId
}:{
    isForGuests : boolean
    timer : ChessTimerOption
    playerId : string
}) {

    const newGame = await db.insert(games).values({
        isForGuests ,
        timer ,
        whiteId : playerId,
    }).returning()

    return newGame[0]
}