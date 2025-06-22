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

    const chess = new Chess(fen)

    useEffect(() => {
        if (!isPlayerTurn && !isGameOver) {
            // after player moves, it’s opponent's turn
            async function fetchBestMove() {
                console.log("fen given to bot : ",fen)
                const res = await getEngineResponse(fen, level)
                if (res.success) {
                    const bestMove = res.bestmove.split(" ")[1]
                    const from = bestMove.slice(0, 2) as Square
                    const to = bestMove.slice(2, 4) as Square
                    const promotion =
                        bestMove.length === 5 ? bestMove.slice(5) : undefined
                    dispatch(move({ from, to, promotion }))
                    const theMove = chess.move({ from, to, promotion })
                    playMoveSound(theMove, chess.inCheck())
                }
            }
            fetchBestMove()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPlayerTurn])

    async function handleSquareClick(square: Square, piece: BoardElement) {
        if (!isPlayerTurn || isGameOver) return
        const isToMove = allowedSquares.includes(square)

        if (isToMove) {
            if (!activePiece)
                throw new Error(
                    "activePieceSquare shouldn't be undefined while isToMove is true "
                )

            const isPromotionSquare =
                (playerColor === "w" && square.slice(1) === "8") ||
                (playerColor === "b" && square.slice(1) === "1")

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
            }
        } else {
            if (piece) dispatch(toMove(piece))
        }
    }

    function handlePromotion(promotion: string, square: Square) {
        if (!activePiece) return
        const moveDetails = {
            from: activePiece.square,
            to: square,
            promotion,
        }
        dispatch(move(moveDetails))
        const theMove = chess.move(moveDetails)
        playMoveSound(theMove, chess.inCheck())
        setIsPromotion(false)
    }

    return (
        <div className="aspect-square w-full grid grid-cols-8 grid-rows-8">
            {board.map((e, i) => {
                const name = indexToSquare(i)
                const isPromotionSquare =
                    (playerColor === "w" && name.slice(1) === "8") ||
                    (playerColor === "b" && name.slice(1) === "1")
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
                    >
                        {isPromotionSquare && (
                            <SelectPromotion
                                onChange={(promotion) =>
                                    handlePromotion(promotion, name)
                                }
                                color={playerColor}
                                open={isPromotion}
                                onOpenChange={(open) => setIsPromotion(open)}
                            />
                        )}
                    </ChessBoardSquare>
                )
            })}
        </div>
    )
}
