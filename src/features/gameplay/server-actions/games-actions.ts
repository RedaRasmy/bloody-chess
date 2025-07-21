"use server"

import { db } from "@/db/drizzle"
import { games } from "@/db/schema"
import { ChessTimerOption } from "@/features/gameplay/types"
import { eq } from "drizzle-orm"
import { parseTimer } from "../utils/parse-timer"
import { FullGame, StartedGame } from "@/db/types"
import { getGuest } from "./guest-actions"
import { getPlayer } from "./player-actions"

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
        const startedGames = await db
            .update(games)
            .set({
                blackId: playerId,
                status: "playing",
                gameStartedAt: new Date(),
            })
            .where(eq(games.id, newGame.id))
            .returning()

        const startedGame = startedGames[0]
        return startedGame as StartedGame
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
                orderBy: (moves, { asc }) => [asc(moves.createdAt)],
            },
        },
    })

    if (!game) throw new Error("No game found")

    const { whiteId, blackId ,gameStartedAt } = game
    if (!whiteId || !blackId || !gameStartedAt) throw new Error("Game not started yet!")

    if (game.isForGuests) {
        const white = await getGuest(whiteId)
        const black = await getGuest(blackId)
        return {
            ...game,
            whiteId,
            blackId,
            gameStartedAt,
            isForGuests: true,
            white,
            black,
        }
    } else {
        const white = await getPlayer(whiteId)
        const black = await getPlayer(blackId)
        return {
            ...game,
            whiteId,
            blackId,
            gameStartedAt,
            isForGuests: false,
            white,
            black,
        }
    }
}
