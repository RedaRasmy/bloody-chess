'use server'

import {db} from '@/db/drizzle'
import {games} from '@/db/schema'
import {ChessTimerOption} from '@/features/gameplay/types'
import { eq } from "drizzle-orm"




// export async function getNewGame() {
//     const newGame = await db.query.games.findFirst({
//         where : (games,{eq}) => eq(games.status,'not-started'),
//         orderBy : (games,{asc}) => [asc(games.createdAt)]
//     })

//     return newGame
// }


/// check if there is a player waiting -> start if yes
export async function startGameIfExists({
    playerId,
    isForGuests,
}: {
    playerId: string
    isForGuests: boolean
}) {
    const newGame = await db.query.games.findFirst({
        where: (games, { eq ,and ,ne}) => and(
            eq(games.status, "not-started"),
            eq(games.isForGuests,isForGuests),
            ne(games.whiteId,playerId)
        ),
        orderBy: (games, { asc }) => [asc(games.createdAt)],
    })

    if (newGame) {
        const startedGame = await db
            .update(games)
            .set({
                blackId: playerId,
                status: "playing",
            })
            .where(eq(games.id, newGame.id))
            .returning()

        return startedGame[0]
    }
}

/// if there is no one waiting for u create one instead :
export async function createGame({
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


export async function deleteGameById(id:string) {
    await db.delete(games).where(eq(games.id,id))
}