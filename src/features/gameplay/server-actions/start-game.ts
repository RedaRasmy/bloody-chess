"use server"

import { db } from "@/db/drizzle"
import { games } from "@/db/schema"
import { eq } from "drizzle-orm"

export default async function startGameIfExists({
    playerId,
    isForGuests,
}: {
    playerId: string
    isForGuests: boolean
}) {
    const newGame = await db.query.games.findFirst({
        where: (games, { eq ,and }) => and(
            eq(games.status, "not-started"),
            eq(games.isForGuests,isForGuests)
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
