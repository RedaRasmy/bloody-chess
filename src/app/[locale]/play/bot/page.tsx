"use client"
import GameDetails from "@/features/gameplay/components/game-details"
import GameLayout from "@/features/gameplay/components/game-layout"
import GameOverPopUp from "@/features/gameplay/components/game-over-pop-up"
import PlayerSection from "@/features/gameplay/components/player-section"
import ChessBoard from "@/features/gameplay/components/chess-board"
import ChessBoardLayout from "@/features/gameplay/components/chess-board-layout"
import { getEngineResponse } from "@/features/gameplay/server-actions/chess-engine"
import { getBestMove } from "@/features/gameplay/utils/get-bestmove"
import { oppositeColor } from "@/features/gameplay/utils/opposite-color"
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
    selectIsUndoRedoable,
    selectLastMove,
    selectLegalMoves,
    selectPieces,
    selectPlayerColor,
    selectScore,
} from "@/redux/slices/game-slice"
import { Chess, Square } from "chess.js"
import { useEffect, useState } from "react"

export default function Page() {
    const dispatch = useAppDispatch()
    const playerColor = useAppSelector(selectPlayerColor)
    const isPlayerTurn = useAppSelector(selectIsPlayerTurn)
    const fen = useAppSelector(selectFEN)
    const pieces = useAppSelector(selectPieces)
    const { level, timer: timerOption } = useAppSelector(selectBotOptions)
    const lastMove = useAppSelector(selectLastMove)
    const isGameOver = useAppSelector(selectIsGameOver)
    const capturedPieces = useAppSelector(selectCapturedPieces)
    const score = useAppSelector(selectScore)
    const legalMoves = useAppSelector(selectLegalMoves)
    const { isRedoable } = useAppSelector(selectIsUndoRedoable)

    const [allowedSquares, setAllowedSquares] = useState<Square[]>([])

    const timer = timerOption ? parseTimer(timerOption) : undefined
    const opponentColor = oppositeColor(playerColor)

    useEffect(() => {
        if (!isPlayerTurn && !isGameOver ) {
            async function fetchBestMove() {
                const res = await getEngineResponse(
                    fen,
                    level > 5 ? level - 5 : 1
                )
                if (res.success) {
                    const bestMove = getBestMove(res, level, fen)
                    dispatch(move(bestMove))
                    const chess = new Chess(fen)
                    const theMove = chess.move(bestMove)
                    playMoveSound(theMove, chess.inCheck())
                }

            }
            fetchBestMove()
        }
    }, [isPlayerTurn , dispatch, level, isGameOver])

    return (
        <GameLayout
            chessBoard={
                <ChessBoardLayout
                    OpponentSection={
                        <PlayerSection
                            capturedPieces={capturedPieces[playerColor]}
                            opponentColor={playerColor}
                            score={score < 0 ? -score : 0}
                            username={`bot-${level}`}
                            timer={timer}
                        />
                    }
                    ChessBoard={
                        <ChessBoard
                            allowedSquares={allowedSquares}
                            lastMove={lastMove}
                            pieces={pieces}
                            playerColor={playerColor}
                            onMoveStart={(piece) => {
                                if (isRedoable || !isPlayerTurn) {
                                    setAllowedSquares([])
                                } else {
                                    const moves = legalMoves[piece.square]
                                    setAllowedSquares(
                                        moves ? moves.map((mv) => mv.to) : []
                                    )
                                }
                            }}
                            onMoveCancel={() => setAllowedSquares([])}
                            onMoveEnd={(mv) => {
                                if (!isPlayerTurn) return
                                dispatch(move(mv))
                                setAllowedSquares([])
                            }}
                            preMoves={[]} // TODO
                        />
                    }
                    PlayerSection={
                        <PlayerSection
                            score={score > 0 ? score : 0}
                            username="Guest"
                            timer={timer}
                            capturedPieces={capturedPieces[opponentColor]}
                            opponentColor={opponentColor}
                        />
                    }
                />
            }
            gameDetails={<GameDetails />}
            gameOverPopUp={<GameOverPopUp />}
        />
    )
}
