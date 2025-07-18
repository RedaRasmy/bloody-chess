"use server"

import { db } from "@/db/drizzle"
import { games } from "@/db/schema"
import {eq} from 'drizzle-orm'

export default async function startGame({ playerId }: { playerId: string }) {
    const newGame = await db.query.games.findFirst({
        where: (games, { eq }) => eq(games.status, "not-started"),
        orderBy: (games, { asc }) => [asc(games.createdAt)],
    })

    if (newGame) {
        const startedGame = await db
            .update(games)
            .set({
                blackId: playerId,
                status: "playing",
            })
            .where(eq(games.id,newGame.id))
    
        return startedGame
    }

}
