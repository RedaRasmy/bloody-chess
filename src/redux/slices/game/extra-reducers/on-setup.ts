import { FullGame } from "@/db/types"
import { PayloadAction } from "@reduxjs/toolkit"
import { GameState } from "../game-types"
import { WritableDraft } from "immer"
import { getCapturedPieces } from "@/features/gameplay/utils/get-captured-pieces"
import getPieces from "@/features/gameplay/utils/get-pieces"
import getExtraPoints from "@/features/gameplay/utils/get-extra-points"
import { Chess, Square } from "chess.js"
import getLegalMoves from "@/features/gameplay/utils/get-legal-moves"

export function onSetup(
    state: WritableDraft<GameState>,
    action: PayloadAction<{ game: FullGame; playerId: string }>
) {
    const { game, playerId } = action.payload
    const whiteName = game.isForGuests
        ? game.whiteName
        : game.whiteName
    const blackName = game.isForGuests
        ? game.blackName
        : game.blackName
    const playerColor = game.whiteId === playerId ? "w" : "b"

    const capturedPieces = getCapturedPieces(game.moves)
    const pieces = getPieces(game.currentFen)
    const { whiteExtraPoints, blackExtraPoints } = getExtraPoints(pieces)
    //

    state.timerOption = game.timer
    state.fen = game.currentFen
    state.history = game.moves.map((mv) => ({
        from: mv.from as Square,
        to: mv.to as Square,
        promotion: mv.promotion || undefined,
        fenAfter: '', // for now  
    }))
    state.players = {
        white: {
            name: whiteName,
            timeLeft: game.whiteTimeLeft,
            capturedPieces: capturedPieces.b,
            extraPoints: whiteExtraPoints,
        },
        black: {
            name: blackName,
            timeLeft: game.blackTimeLeft,
            capturedPieces: capturedPieces.w,
            extraPoints: blackExtraPoints,
        },
    }
    state.currentTurn = game.currentTurn
    state.legalMoves = getLegalMoves(new Chess(game.currentFen))
    state.pieces = pieces
    state.playerColor = playerColor
    state.currentTurn = game.currentTurn
}
