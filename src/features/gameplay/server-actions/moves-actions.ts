"use server"

import { db } from "@/db/drizzle"
import { games, moves } from "@/db/schema"
import { MoveType, PromotionPiece } from "../types"
import { Chess } from "chess.js"
import { eq } from "drizzle-orm"
import { calculateTimeLeft } from "../utils/calculate-time-left"
import { getGameoverCause } from "../utils/get-gameover-cause"

export async function addMove(move: MoveType) {
    // const newMove = await db.insert(moves).values({
    //     moveNumber
    // })
}

export async function makeMove({
    gameId,
    move,
}: {
    gameId: string
    move: MoveType
}) {
    const game = await db.query.games.findFirst({
        where: (games, { eq }) => eq(games.id, gameId),
    })
    if (!game) throw new Error("No game found with id: " + gameId)
    const chess = new Chess(game.currentFen)
    const Move = chess.move(move)

    const lastMoveAt = game.lastMoveAt || game.gameStartedAt
    if (!lastMoveAt)
        throw new Error(
            "You cant make a move while game is not started yet : lastMoveAt and gameCreatedAt are null"
        )

    const { black, white } = calculateTimeLeft({
        blackTimeLeft: game.whiteTimeLeft,
        whiteTimeLeft: game.blackTimeLeft,
        lastMoveAt,
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
    // const turn = chess.turn()

    // Update game
    await db
        .update(games)
        .set({
            currentFen: chess.fen(),
            currentTurn: chess.turn(),
            whiteTimeLeft: white,
            blackTimeLeft: black,
            lastMoveAt: new Date(),
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

    // add move
    const newMoves = await db
        .insert(moves)
        .values({
            fenAfter: chess.fen(),
            from: move.from,
            to: move.to,
            promotion: move.promotion as PromotionPiece,
            moveTime: Date.now() - lastMoveDate.getTime(),
            piece: Move.piece,
            gameId,
            playerColor: game.currentTurn,
            san: Move.san,
            capturedPiece: Move.captured,
            isCheck: chess.isCheck(),
            isCheckmate: chess.isCheckmate(),
        })
        .returning()

    return { success: true, newMove: newMoves[0] }
}
