"use server"

import { db } from "@/db/drizzle"
import { games, moves, players } from "@/db/schema"
import { MoveType, PromotionPiece } from "../types"
import { Chess } from "chess.js"
import { eq, inArray, sql } from "drizzle-orm"
import { calculateTimeLeft } from "../utils/calculate-time-left"
import { getGameoverCause } from "../utils/get-gameover-cause"
import parseTimerOption from "../utils/parse-timer-option"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import getColorName from "../utils/get-color-name"

export async function getMoves(gameId: string) {
    const gameMoves = await db.query.moves.findMany({
        where: (moves, { eq }) => eq(moves.gameId, gameId),
        orderBy: (moves, { asc }) => [asc(moves.createdAt)],
    })
    return gameMoves
}

export async function makeMove({
    gameId,
    move,
}: {
    gameId: string
    move: MoveType
}) {
    /// Get The Current Game State
    const game = await db.query.games.findFirst({
        where: (games, { eq }) => eq(games.id, gameId),
    })

    /// Some Logical Checks
    if (!game) {
        throw new Error("No game found with id: " + gameId)
    } else if (game.status === "matching" || game.status === "preparing") {
        throw new Error("Unallowed Move : The game not started yet ")
    } else if (game.status === "finished") {
        throw new Error("Unallowed Move : The game already finsihed")
    }

    /// AUTH
    if (!game.isForGuests) {
        const session = await getServerSession(authOptions)
        if (!session) throw new Error("Unauthenticated")
        const playerId = session.user.playerId
        const currentPlayerId =
            game.currentTurn === "w" ? game.whiteId : game.blackId

        if (playerId !== currentPlayerId)
            throw new Error(
                "Unauthorized , You are not allowed to make move for " +
                    getColorName(game.currentTurn) +
                    " player"
            )
    }

    const lastMoveAt = game.lastMoveAt || game.gameStartedAt
    if (!lastMoveAt)
        throw new Error(
            "You can't make a move while game is not started yet : lastMoveAt and gameCreatedAt are null"
        )

    /// Move Logic
    const chess = new Chess(game.currentFen)
    const validatedMove = chess.move(move)
    const playerColor = validatedMove.color

    const { plus } = parseTimerOption(game.timer)

    const { whiteTimeLeft, blackTimeLeft } = calculateTimeLeft({
        blackTimeLeft: game.blackTimeLeft,
        whiteTimeLeft: game.whiteTimeLeft,
        lastMoveAt: new Date(lastMoveAt),
        currentTurn: game.currentTurn,
    })

    const gameOverCause = getGameoverCause({
        isCheckmate: chess.isCheckmate(),
        isDrawByFiftyMoves: chess.isDrawByFiftyMoves(),
        isInsufficientMaterial: chess.isInsufficientMaterial(),
        isStalemate: chess.isStalemate(),
        isThreefoldRepetition: chess.isThreefoldRepetition(),
        /// nothing to do with makeMove
        isResign: false,
        isTimeOut: false,
    })

    const lastMoveDate = new Date(lastMoveAt)
    const isGameOver = chess.isGameOver()
    const isDraw = chess.isDraw()

    // Update game
    const [udpatedGame] = await db
        .update(games)
        .set({
            currentFen: chess.fen(),
            currentTurn: chess.turn(),
            whiteTimeLeft:
                playerColor === "w"
                    ? whiteTimeLeft + plus * 1000
                    : whiteTimeLeft,
            blackTimeLeft:
                playerColor === "b"
                    ? blackTimeLeft + plus * 1000
                    : blackTimeLeft,
            lastMoveAt: Date.now(),
            gameOverReason: gameOverCause,
            status: isGameOver ? "finished" : "playing",
            result: isGameOver
                ? isDraw
                    ? "draw"
                    : game.currentTurn === "w"
                    ? "white_won"
                    : "black_won"
                : null,
        })
        .where(eq(games.id, gameId))
        .returning()

    /// Insert Move
    const newMoves = await db
        .insert(moves)
        .values({
            fenAfter: chess.fen(),
            from: move.from,
            to: move.to,
            promotion: move.promotion as PromotionPiece,
            moveTime: Date.now() - lastMoveDate.getTime(),
            piece: validatedMove.piece,
            gameId,
            playerColor: game.currentTurn,
            san: validatedMove.san,
            capturedPiece: validatedMove.captured,
            isCheck: chess.isCheck(),
            isCheckmate: chess.isCheckmate(),
        })
        .returning()

    // update players stats if game is finished and is not for guests
    if (udpatedGame.status === "finished" && !udpatedGame.isForGuests) {
        const isDraw = udpatedGame.result === "draw"
        if (isDraw) {
            await db
                .update(players)
                .set({
                    gamesPlayed: sql`${players.gamesPlayed} +1`,
                    draws: sql`${players.draws} +1`,
                })
                .where(
                    inArray(players.id, [
                        udpatedGame.whiteId,
                        udpatedGame.blackId as string,
                    ])
                )
        } else {
            const winnerId =
                game.result === "white_won"
                    ? game.whiteId
                    : (game.blackId as string)
            const loserId =
                game.result === "white_won"
                    ? (game.blackId as string)
                    : game.whiteId
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

    return { success: true, newMove: newMoves[0] }
}
