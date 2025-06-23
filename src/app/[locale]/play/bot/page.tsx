"use client"
import ChessBoardLayout from "@/features/gameplay/components/chess-board-layout"
import GameDetails from "@/features/gameplay/components/game-details"
import GameLayout from "@/features/gameplay/components/game-layout"
import GameOverPopUp from "@/features/gameplay/components/game-over-pop-up"
import { getEngineResponse } from "@/features/gameplay/server-actions/chess-engine"
import { getBestMove } from "@/features/gameplay/utils/get-bestmove"
import { playMoveSound } from "@/features/gameplay/utils/play-move-sound"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { selectBotOptions } from "@/redux/slices/game-options"
import {
    cancelMove,
    move,
    selectActivePiece,
    selectAllowedSquares,
    selectCapturedPieces,
    selectFEN,
    selectIsGameOver,
    selectIsPlayerTurn,
    selectLastMove,
    selectPlayerColor,
    selectScore,
    toMove,
} from "@/redux/slices/game-slice"
import { Chess } from "chess.js"
import React, { useEffect } from "react"

export default function Page() {
    // chessEngine calls should be here
    // for now connect with game-slice to valide moves in the client for play/bot
    const dispatch = useAppDispatch()
    const allowedSquares = useAppSelector(selectAllowedSquares)
    const playerColor = useAppSelector(selectPlayerColor)
    const isPlayerTurn = useAppSelector(selectIsPlayerTurn)
    const fen = useAppSelector(selectFEN)
    const { level } = useAppSelector(selectBotOptions)
    const lastMove = useAppSelector(selectLastMove)
    const activePiece = useAppSelector(selectActivePiece)
    const isGameOver = useAppSelector(selectIsGameOver)
    const capturedPieces = useAppSelector(selectCapturedPieces)
    const score = useAppSelector(selectScore)

    const chess = new Chess(fen)

    useEffect(() => {
        if (!isPlayerTurn && !isGameOver) {
            // after player moves, it’s opponent's turn
            async function fetchBestMove() {
                const res = await getEngineResponse(
                    fen,
                    level > 5 ? level - 5 : 1
                )
                if (res.success) {
                    const bestMove = getBestMove(res, level, fen)
                    dispatch(move(bestMove))
                    const theMove = chess.move(bestMove)
                    playMoveSound(theMove, chess.inCheck())
                }
            }
            fetchBestMove()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPlayerTurn])

    return (
        <GameLayout
            chessBoard={
                <ChessBoardLayout
                    activePiece={activePiece}
                    onMoveStart={(piece) => dispatch(toMove(piece))}
                    onMoveEnd={(mv) => dispatch(move(mv))}
                    fen={fen}
                    capturedPieces={capturedPieces}
                    moving={{
                        allowedSquares,
                        isMoving: !!activePiece,
                    }}
                    playerColor={playerColor}
                    players={{
                        player: {
                            name: "Guest",
                        },
                        opponent: {
                            name: `Bot-${level}`,
                        },
                    }}
                    score={score}
                    lastMove={lastMove}
                    onMoveCancel={() => dispatch(cancelMove())}
                />
            }
            gameDetails={<GameDetails />}
            gameOverPopUp={<GameOverPopUp />}
        />
    )
}
