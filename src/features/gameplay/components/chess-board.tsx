import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { selectBotOptions } from "@/redux/slices/game-options"
import {
    move,
    selectActivePiece,
    selectAllowedSquares,
    selectBoard,
    selectFEN,
    selectIsGameOver,
    selectIsPlayerTurn,
    selectLastMove,
    selectPlayerColor,
    toMove,
} from "@/redux/slices/game-slice"
import { Chess, Square } from "chess.js"
import ChessBoardSquare from "./chess-board-square"
import { getSquareColor } from "../utils/get-square-color"
import { indexToSquare } from "../utils/index-to-square"
import { useEffect, useState } from "react"
import { playMoveSound } from "../utils/play-move-sound"
import { BoardElement } from "../types"
import SelectPromotion from "./select-promotion"
import { getEngineResponse } from "../server-actions/chess-engine"
import { getBestMove } from "../utils/get-bestmove"
import { cn } from "@/lib/utils"

export default function ChessBoard() {
    const dispatch = useAppDispatch()

    const board = useAppSelector(selectBoard).flat()
    const allowedSquares = useAppSelector(selectAllowedSquares)
    const playerColor = useAppSelector(selectPlayerColor)
    const isPlayerTurn = useAppSelector(selectIsPlayerTurn)
    const fen = useAppSelector(selectFEN)
    const { level } = useAppSelector(selectBotOptions)
    const lastMove = useAppSelector(selectLastMove)
    const activePiece = useAppSelector(selectActivePiece)
    const isGameOver = useAppSelector(selectIsGameOver)

    const [isPromotion, setIsPromotion] = useState(false)
    const [targetSquare, setTargetSquare] = useState<Square | null>(null)

    const promotionRank = playerColor === "w" ? "8" : "1"

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
                    const bestMove = getBestMove(
                        res,
                        level,
                        chess.moves({ verbose: true })
                    )
                    dispatch(move(bestMove))
                    const theMove = chess.move(bestMove)
                    playMoveSound(theMove, chess.inCheck())
                }
            }
            fetchBestMove()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPlayerTurn])

    async function handleSquareClick(square: Square, piece: BoardElement) {
        if (!isPlayerTurn || isGameOver) return
        setTargetSquare(square)
        const isToMove = allowedSquares.includes(square)

        if (isToMove) {
            if (!activePiece)
                throw new Error(
                    "activePieceSquare shouldn't be undefined while isToMove is true "
                )

            const isPromotionSquare = promotionRank === square.slice(1)

            if (isPromotionSquare && activePiece.type === "p") {
                // open promotion dialog
                setIsPromotion(true)
            } else {
                dispatch(move({ from: activePiece.square, to: square }))
                const theMove = chess.move({
                    from: activePiece.square,
                    to: square,
                })
                playMoveSound(theMove, chess.inCheck())
                setTargetSquare(null)
            }
        } else {
            if (piece) {
                dispatch(toMove(piece))
                setTargetSquare(null)
            }
        }
    }

    function handlePromotion(promotion: string) {
        if (!activePiece || !targetSquare) return
        const moveDetails = {
            from: activePiece.square,
            to: targetSquare,
            promotion,
        }
        dispatch(move(moveDetails))
        const theMove = chess.move(moveDetails)
        playMoveSound(theMove, chess.inCheck())
        setIsPromotion(false)
        setTargetSquare(null)
    }

    return (
        <div className="relative w-full h-full">
            <SelectPromotion
                onChange={(promotion) => handlePromotion(promotion)}
                color={playerColor}
                open={isPromotion}
                onClickOutside={() => setIsPromotion(false)}
            />
            <div
                className={cn(
                    "aspect-square w-full grid grid-cols-8 grid-rows-8  ",
                    {
                        "rotate-180": playerColor === "b",
                    }
                )}
            >
                {board.map((e, i) => {
                    const name = indexToSquare(i)
                    return (
                        <ChessBoardSquare
                            key={i}
                            color={getSquareColor(i)}
                            name={name}
                            piece={e}
                            isToMove={allowedSquares.includes(name)}
                            isLastMove={
                                !!lastMove &&
                                (lastMove.from == name || lastMove.to == name)
                            }
                            onClick={handleSquareClick}
                        ></ChessBoardSquare>
                    )
                })}
            </div>
        </div>
    )
}
