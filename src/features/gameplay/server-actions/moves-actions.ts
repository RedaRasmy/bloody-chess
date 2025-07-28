"use server"

import { db } from "@/db/drizzle"
import { games, moves } from "@/db/schema"
import { MoveType, PromotionPiece } from "../types"
import { Chess } from "chess.js"
import { eq } from "drizzle-orm"
import { calculateTimeLeft } from "../utils/calculate-time-left"
import { getGameoverCause } from "../utils/get-gameover-cause"
import parseTimerOption from "../utils/parse-timer-option"

export async function getMoves(gameId: string) {
    const gameMoves = await db.query.moves.findMany({
        where : (moves,{eq}) => eq(moves.gameId,gameId),
        orderBy: (moves, { asc }) => [asc(moves.createdAt)]
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
    const game = await db.query.games.findFirst({
        where: (games, { eq }) => eq(games.id, gameId),
    })
    if (!game) throw new Error("No game found with id: " + gameId)
    const chess = new Chess(game.currentFen)
    const validatedMove = chess.move(move)
    const playerColor = validatedMove.color

    const {plus} = parseTimerOption(game.timer) 

    const lastMoveAt = game.lastMoveAt || game.gameStartedAt
    if (!lastMoveAt)
        throw new Error(
            "You cant make a move while game is not started yet : lastMoveAt and gameCreatedAt are null"
        )

    const { whiteTimeLeft, blackTimeLeft } = calculateTimeLeft({
        blackTimeLeft: game.blackTimeLeft,
        whiteTimeLeft: game.whiteTimeLeft,
        lastMoveAt : new Date(lastMoveAt),
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
    await db
        .update(games)
        .set({
            currentFen: chess.fen(),
            currentTurn: chess.turn(),
            whiteTimeLeft : playerColor === 'w' ? whiteTimeLeft + plus*1000 : whiteTimeLeft,
            blackTimeLeft : playerColor === 'b' ? blackTimeLeft + plus*1000 : blackTimeLeft,
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

    // insert move
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

    return { success: true, newMove: newMoves[0] }
}
