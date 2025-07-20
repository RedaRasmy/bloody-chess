"use server"

import { db } from "@/db/drizzle"
import { games } from "@/db/schema"
import { ChessTimerOption } from "@/features/gameplay/types"
import { eq } from "drizzle-orm"
import { parseTimer } from "../utils/parse-timer"
import { FullGame } from "@/db/types"

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
    timerOption,
}: {
    playerId: string
    isForGuests: boolean
    timerOption: ChessTimerOption
}) {
    const newGame = await db.query.games.findFirst({
        where: (games, { eq, and, ne }) =>
            and(
                eq(games.status, "not-started"),
                eq(games.isForGuests, isForGuests),
                ne(games.whiteId, playerId),
                eq(games.timer, timerOption)
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
    isForGuests,
    timerOption,
    playerId,
}: {
    isForGuests: boolean
    timerOption: ChessTimerOption
    playerId: string
}) {
    const timer = parseTimer(timerOption)

    const newGame = await db
        .insert(games)
        .values({
            isForGuests,
            timer: timerOption,
            whiteId: playerId,
            blackTimeLeft: timer.base * 1000,
            whiteTimeLeft: timer.base * 1000,
            currentTurn: "w",
        })
        .returning()

    return newGame[0]
}

export async function deleteGameById(id: string) {
    await db.delete(games).where(eq(games.id, id))
}

export async function getFullGame(id: string): Promise<FullGame> {
    const game = await db.query.games.findFirst({
        where: (games, { eq }) => eq(games.id, id),
        with: {
            moves: {
                orderBy: (moves, { asc }) => [asc(moves.moveNumber)],
            },
        },
    })

    if (!game) throw new Error("No game found")
    // if (!game.whiteId || !game.blackId) throw new Error("Game not started yet!")

    const { whiteId, blackId } = game
    if (!whiteId || !blackId) throw new Error("players should be both in game")

    if (game.isForGuests) {
        const white = await db.query.guests.findFirst({
            where: (guests, { eq }) => eq(guests.id, whiteId),
        })
        const black = await db.query.guests.findFirst({
            where: (guests, { eq }) => eq(guests.id, blackId),
        })
        if (!white || !black)
            throw new Error("players should be both in database [table:guests]")
        return {
            ...game,
            whiteId ,
            blackId,
            isForGuests: true,
            white,
            black,
        }
    } else {
        const white = await db.query.players.findFirst({
            where: (players, { eq }) => eq(players.id, whiteId),
        })
        const black = await db.query.players.findFirst({
            where: (players, { eq }) => eq(players.id, blackId),
        })
        if (!white || !black)
            throw new Error(
                "players should be both in database [table:players]"
            )
        return {
            ...game,
            whiteId,
            blackId,
            isForGuests: false,
            white,
            black,
        }
    }
}
