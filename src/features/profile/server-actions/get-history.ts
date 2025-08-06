"use server"
import { db } from "@/db/drizzle"
import { PlayedGame } from "../profile-types"
import { sql } from "drizzle-orm"
import { games } from "@/db/schema"
import { Color } from "chess.js"

export async function getHistory(playerId: string): Promise<PlayedGame[]> {
    const history = await db.query.games.findMany({
        where: (games, { eq, or, and }) =>
            and(
                or(eq(games.whiteId, playerId), eq(games.blackId, playerId)),
                eq(games.status, "finished")
            ),
        columns: {
            id:true,
            result: true,
            timer: true,
        },
        extras: {
            color: sql`
                case 
                when ${games.whiteId} = ${playerId} then 'w'
                else 'b'
                end
            `.as("color"),
        },
        orderBy : (games,{desc}) => [desc(games.createdAt)]
    })

    return history.map((game) => ({
        id : game.id,
        color: game.color as Color,
        result:
            game.result === "draw"
                ? "draw"
                : game.result === "white_won"
                    ? game.color === "w"
                        ? "win"
                        : "lose"
                    : game.color === "b"
                        ? "win"
                        : "lose",
        timerOption: game.timer,
    }))
}
