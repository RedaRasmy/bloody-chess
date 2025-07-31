"use server"

import { db } from "@/db/drizzle"
import { games } from "@/db/schema"
import { ChessTimerOption } from "@/features/gameplay/types"
import { eq } from "drizzle-orm"
import parseTimerOption from "../utils/parse-timer-option"
import { FullGame, GameStatus, NewGame, StartedGame } from "@/db/types"
import { getGuest } from "./guest-actions"
import { getPlayer } from "./player-actions"
import { Color, Square } from "chess.js"

/// check if there is a player waiting -> start if yes
export async function matchGameIfExist({
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
                eq(games.status, "matching"),
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
                status: "preparing",
            })
            .where(eq(games.id, newGame.id))
            .returning()

        const startedGame = startedGames[0]
        return {
            ...startedGame,
            createdAt: startedGame.createdAt.getTime(),
            updatedAt: startedGame.updatedAt.getTime(),
        } as StartedGame
    }
}

/// if there is no one waiting for u create new one instead :
export async function createGame({
    isForGuests,
    timerOption,
    playerId,
}: {
    isForGuests: boolean
    timerOption: ChessTimerOption
    playerId: string
}): Promise<NewGame> {
    const timer = parseTimerOption(timerOption)

    const result = await db
        .insert(games)
        .values({
            isForGuests,
            timer: timerOption,
            whiteId: playerId,
            blackTimeLeft: timer.base * 1000,
            whiteTimeLeft: timer.base * 1000,
        })
        .returning()

    const newGame = result[0]
    return {
        ...newGame,
        createdAt: newGame.createdAt.getTime(),
        updatedAt: newGame.updatedAt.getTime(),
    } as NewGame
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

    if (!game) throw new Error("Game not found")

    const { whiteId, blackId } = game
    if (!blackId) throw new Error("Game not matched yet!")

    const whiteName = game.isForGuests
        ? (await getGuest(whiteId)).displayName
        : (await getPlayer(whiteId)).username
    const blackName = game.isForGuests
        ? (await getGuest(blackId)).displayName
        : (await getPlayer(blackId)).username

    return {
        ...game,
        whiteName,
        blackName,
        moves: game.moves.map((mv) => ({
            from: mv.from as Square,
            to: mv.to as Square,
            promotion: mv.promotion || undefined,
            fenAfter: mv.fenAfter,
        })),
        createdAt: game.createdAt.getTime(),
        updatedAt: game.updatedAt.getTime(),
    } as FullGame
}

export async function sendTimeOut(gameId: string, playerColor: Color) {
    /// i should protect this
    const updateData =
        playerColor === "w" ? { whiteTimeLeft: 0 } : { blackTimeLeft: 0 }
    await db
        .update(games)
        .set({
            ...updateData,
            status: "finished",
            gameOverReason: "Timeout",
            result: playerColor === "w" ? "black_won" : "white_won",
        })
        .where(eq(games.id, gameId))
}

export async function sendResign(gameId: string, playerColor: Color) {
    /// i should protect this

    await db
        .update(games)
        .set({
            status: "finished",
            gameOverReason: "Resignation",
            result: playerColor === "w" ? "black_won" : "white_won",
        })
        .where(eq(games.id, gameId))
}

export async function startGame(gameId: string, playerColor: Color) {
    await db.transaction(async (tx) => {
        const [matchedGame] = await tx
            .select()
            .from(games)
            .where(eq(games.id, gameId))
            .for("update")

        if (!matchedGame) {
            throw new Error("startGame : Game not found with id=" + gameId)
        }
        if (matchedGame.status !== "preparing") {
            throw new Error(
                "startGame : Game is not matched yet or already prepared"
            )
        }

        const updates =
            playerColor === "w"
                ? {
                      whiteReady: true,
                      status: "preparing" as GameStatus,
                      gameStartedAt: null as null | number,
                  }
                : {
                      blackReady: true,
                      status: "preparing" as GameStatus,
                      gameStartedAt: null as null | number,
                  }

        // Check if both will be ready after this update
        const isOtherPlayerReady =
            playerColor === "w"
                ? matchedGame.blackReady === true
                : matchedGame.whiteReady === true

        if (isOtherPlayerReady) {
            updates.status = "playing"
            updates.gameStartedAt = Date.now() + 3000 // will start after 3s
        }

        console.log(
            playerColor + " -- is other player ready : ",
            isOtherPlayerReady
        )

        await tx.update(games).set(updates).where(eq(games.id, gameId))
    })



}

export async function updateGameStatus(gameId: string, status: GameStatus) {
    await db
        .update(games)
        .set({
            status,
        })
        .where(eq(games.id, gameId))
}
