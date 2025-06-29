"use client"
import ChessBoardLayout from "@/features/gameplay/components/chess-board-layout"
import GameDetails from "@/features/gameplay/components/game-details"
import GameLayout from "@/features/gameplay/components/game-layout"
import GameOverPopUp from "@/features/gameplay/components/game-over-pop-up"
import { getEngineResponse } from "@/features/gameplay/server-actions/chess-engine"
import { getBestMove } from "@/features/gameplay/utils/get-bestmove"
import { parseTimer } from "@/features/gameplay/utils/parse-timer"
import { playMoveSound } from "@/features/gameplay/utils/play-move-sound"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { selectBotOptions } from "@/redux/slices/game-options"
import {
    move,
    selectCapturedPieces,
    selectFEN,
    selectIsGameOver,
    selectIsPlayerTurn,
    selectLastMove,
    selectLegalMoves,
    selectPlayerColor,
    selectScore,
} from "@/redux/slices/game-slice"
import { Chess, Square } from "chess.js"
import React, { useEffect, useState } from "react"

export default function Page() {
    // chessEngine calls should be here
    // for now connect with game-slice to valide moves in the client for play/bot
    const dispatch = useAppDispatch()
    const playerColor = useAppSelector(selectPlayerColor)
    const isPlayerTurn = useAppSelector(selectIsPlayerTurn)
    const fen = useAppSelector(selectFEN)
    const { level , timer} = useAppSelector(selectBotOptions)
    const lastMove = useAppSelector(selectLastMove)
    const isGameOver = useAppSelector(selectIsGameOver)
    const capturedPieces = useAppSelector(selectCapturedPieces)
    const score = useAppSelector(selectScore)
    const legalMoves = useAppSelector(selectLegalMoves)

    const [allowedSquares,setAllowedSquares] = useState<Square[]>([])

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
                    onMoveStart={(piece) => {
                        const moves = legalMoves[piece.square]
                        setAllowedSquares(moves ? moves.map(mv=>mv.to) : [])
                    }}
                    onMoveEnd={(mv) => {dispatch(move(mv));setAllowedSquares([])}}
                    fen={fen}
                    capturedPieces={capturedPieces}
                    allowedSquares={allowedSquares}
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
                    onMoveCancel={() => setAllowedSquares([])}
                    timer={timer ? parseTimer(timer) : undefined}
                />
            }
            gameDetails={<GameDetails />}
            gameOverPopUp={<GameOverPopUp />}
        />
    )
}
