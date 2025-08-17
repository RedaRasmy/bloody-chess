"use server"

import { db } from "@/db/drizzle"
import { games, players } from "@/db/schema"
import { ChessTimerOption } from "@/features/gameplay/types"
import { eq, inArray, sql } from "drizzle-orm"
import parseTimerOption from "../utils/parse-timer-option"
import { FullGame, GameStatus, NewGame, MatchedGame } from "@/db/types"
import { getGuest } from "./guest-actions"
import { getPlayer } from "./player-actions"
import { Color, Square } from "chess.js"
import { getServerSession } from "next-auth"
import getColorName from "../utils/get-color-name"
import { authOptions } from "@/lib/auth-options"

export async function getGameById(id: string) {
    const game = await db.query.games.findFirst({
        where: (games, { eq }) => eq(games.id, id),
    })
    return game
}

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
        } as MatchedGame
    }
}

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
    // this is safe enough for now by checking if timeLeft < 1s
    // no need to check auth ... at least for now :)

    const game = await db.query.games.findFirst({
        where: (games, { eq }) => eq(games.id, gameId),
    })

    if (!game) throw new Error("Game not found")

    const timeLeft =
        playerColor === "w" ? game.whiteTimeLeft : game.blackTimeLeft

    // ignore request if timeleft not under 1s or game is not active
    if (game.status !== "playing" || timeLeft >= 1000) return

    const updateData =
        playerColor === "w" ? { whiteTimeLeft: 0 } : { blackTimeLeft: 0 }

    const [{ isForGuests, whiteId, blackId }] = await db
        .update(games)
        .set({
            ...updateData,
            status: "finished",
            gameOverReason: "Timeout",
            result: playerColor === "w" ? "black_won" : "white_won",
        })
        .where(eq(games.id, gameId))
        .returning()

    // update players stats
    if (!isForGuests) {
        const winnerId = playerColor === "w" ? (blackId as string) : whiteId
        const loserId = playerColor === "b" ? (blackId as string) : whiteId
        // update winner
        await db
            .update(players)
            .set({
                gamesPlayed: sql`${players.gamesPlayed} +1`,
                wins: sql`${players.wins} +1`,
            })
            .where(eq(players.id, winnerId))
        // udpate loser
        await db
            .update(players)
            .set({
                gamesPlayed: sql`${players.gamesPlayed} +1`,
                losses: sql`${players.losses} +1`,
            })
            .where(eq(players.id, loserId))
    }
}

export async function sendResign(gameId: string, playerColor: Color) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
        throw new Error("Unauthenticated")
    }
    const { playerId } = session.user

    const game = await db.query.games.findFirst({
        where: (games, { eq }) => eq(games.id, gameId),
    })

    if (!game) throw new Error("Game not found")
    if (!game.blackId) throw new Error("Game not started yet")

    const resignerId = playerColor === "w" ? game.whiteId : game.blackId
    if (resignerId !== playerId)
        throw new Error(
            "Unauthorized , You are not allowed to resign for " +
                getColorName(playerColor) +
                " player"
        )

    const [{ isForGuests, whiteId, blackId }] = await db
        .update(games)
        .set({
            status: "finished",
            gameOverReason: "Resignation",
            result: playerColor === "w" ? "black_won" : "white_won",
        })
        .where(eq(games.id, gameId))
        .returning()

    // update players stats
    if (!isForGuests) {
        const winnerId = playerColor === "w" ? (blackId as string) : whiteId
        const loserId = playerColor === "b" ? (blackId as string) : whiteId
        // update winner
        await db
            .update(players)
            .set({
                gamesPlayed: sql`${players.gamesPlayed} +1`,
                wins: sql`${players.wins} +1`,
            })
            .where(eq(players.id, winnerId))
        // udpate loser
        await db
            .update(players)
            .set({
                gamesPlayed: sql`${players.gamesPlayed} +1`,
                losses: sql`${players.losses} +1`,
            })
            .where(eq(players.id, loserId))
    }
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

export async function drawAction(gameId: string) {
    const [{ isForGuests, whiteId, blackId }] = await db
        .update(games)
        .set({
            status: "finished",
            gameOverReason: "Agreement",
            result: "draw",
        })
        .where(eq(games.id, gameId))
        .returning()

    // update players stats
    if (!isForGuests) {
        await db
            .update(players)
            .set({
                gamesPlayed: sql`${players.gamesPlayed} +1`,
                draws: sql`${players.draws} +1`,
            })
            .where(inArray(players.id, [whiteId, blackId as string]))
    }
}

export async function rematchAction({
    whiteId,
    blackId,
    timerOption,
    isForGuests,
}: {
    whiteId: string
    blackId: string
    timerOption: ChessTimerOption
    isForGuests: boolean
}) {
    const { base } = parseTimerOption(timerOption)
    const timeLeft = base * 1000

    const [newGame] = await db
        .insert(games)
        .values({
            isForGuests,
            timer: timerOption,
            whiteId: blackId,
            blackId: whiteId,
            blackTimeLeft: timeLeft,
            whiteTimeLeft: timeLeft,
            status: "preparing",
        })
        .returning()

    return newGame
}

export async function getCurrentGame(playerId: string) {
    return await db.query.games.findFirst({
        where: (games, { eq, or, and }) =>
            and(
                or(eq(games.whiteId, playerId), eq(games.blackId, playerId)),
                eq(games.status, "playing")
            ),
    })
}
