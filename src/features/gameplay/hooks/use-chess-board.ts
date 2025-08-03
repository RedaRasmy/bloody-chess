import useChessBoardWidth from "@/features/gameplay/hooks/useChessBoardWidth"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { Chess, PieceSymbol, Square } from "chess.js"
import { useState } from "react"
import {
    selectActivePiece,
    selectLegalMoves,
    selectPlayerColor,
    selectIsPlayerTurn,
    selectLastMove,
    selectPieces,
    selectFEN,
    selectIsGameOver,
} from "@/redux/slices/game/game-selectors"
import getSquares from "../utils/get-squares"
import { BoardElement, MoveType } from "../types"
import { promotionRank } from "../utils/promotion-rank"
import { rank } from "../utils/rank-file"
import { move, select, unselect } from "@/redux/slices/game/game-slice"
import { DragEndEvent, DragStartEvent } from "@dnd-kit/core"
import { playMoveSound } from "../utils/play-move-sound"
import { selectIsMovesSoundsEnabled } from "@/redux/slices/settings/settings-selectors"
import safeMove from "../utils/safe-move"

export default function useChessBoard({
    onMoveEnd,
}: {
    onMoveEnd?: (move: MoveType) => Promise<void>
}) {
    const dispatch = useAppDispatch()
    const activePiece = useAppSelector(selectActivePiece)
    const legalMoves = useAppSelector(selectLegalMoves)
    const playerColor = useAppSelector(selectPlayerColor)
    const isPlayerTurn = useAppSelector(selectIsPlayerTurn)
    const lastMove = useAppSelector(selectLastMove)
    const pieces = useAppSelector(selectPieces)
    const fen = useAppSelector(selectFEN)
    const isGameOver = useAppSelector(selectIsGameOver)
    const isMovesSoundEnabled = useAppSelector(selectIsMovesSoundsEnabled)

    const [isPromoting, setIsPromoting] = useState(false)
    const [targetSquare, setTargetSquare] = useState<Square | null>(null)
    const boardWidth = useChessBoardWidth()
    const allowedSquares = activePiece
        ? legalMoves[activePiece.square]?.map((mv) => mv.to) ?? []
        : []

    const squares = getSquares(playerColor === "b")

    async function promote(promotion: string) {
        if (isGameOver || !activePiece || !targetSquare) return

        const mv = {
            from: activePiece.square,
            to: targetSquare,
            promotion: promotion as PieceSymbol,
        }

        dispatch(move(mv))
        setIsPromoting(false)
        setTargetSquare(null)
        if (isMovesSoundEnabled) {
            const chess = new Chess(fen)
            const validatedMove = safeMove(chess, mv)
            if (validatedMove) playMoveSound(validatedMove, chess.isCheck())
        }
        await onMoveEnd?.(mv)
    }

    async function clickSquare(square: Square) {
        // clicking a square should only : cancel a move or play a move

        if (activePiece && allowedSquares.length > 0) {
            if (!isGameOver && allowedSquares.includes(square)) {
                const isPromotionMove =
                    promotionRank(playerColor) === rank(square) &&
                    activePiece.type === "p"
                if (isPromotionMove) {
                    setTargetSquare(square)
                    setIsPromoting(true)
                } else {
                    const mv = {
                        from: activePiece.square,
                        to: square,
                    }
                    dispatch(move(mv))
                    if (isMovesSoundEnabled) {
                        const chess = new Chess(fen)
                        const validatedMove = safeMove(chess, mv)
                        if (validatedMove)
                            playMoveSound(validatedMove, chess.isCheck())
                    }
                    await onMoveEnd?.(mv)
                }
            } else {
                // cancel move , active piece should return to null
                dispatch(unselect())
            }
        }
    }

    function drag(event: DragStartEvent) {
        const { active } = event
        const piece = active.data.current as Exclude<BoardElement, null>
        /// prevent unnecesasry calculations :
        // if not a player's piece
        if (piece.color !== playerColor) return

        dispatch(select(piece))
    }

    async function drop(event: DragEndEvent) {
        if (!activePiece || isGameOver) return

        const { over } = event

        if (!over || over.id === activePiece.square) return
        const targetSquare = over.id as Square

        if (isPlayerTurn) {
            if (allowedSquares.includes(targetSquare)) {
                const isPromotionMove =
                    promotionRank(playerColor) === rank(targetSquare) &&
                    activePiece.type === "p"
                if (isPromotionMove) {
                    setTargetSquare(targetSquare)
                    setIsPromoting(true)
                } else {
                    const mv = {
                        from: activePiece.square,
                        to: targetSquare,
                    }
                    dispatch(move(mv))
                    if (isMovesSoundEnabled) {
                        const chess = new Chess(fen)
                        const validatedMove = safeMove(chess, mv)
                        if (validatedMove)
                            playMoveSound(validatedMove, chess.isCheck())
                    }
                    await onMoveEnd?.(mv)
                }
            }
        } else {
            // TODO: premoves
            // const isPromotionMove =
            //     promotionRank(playerColor) === rank(targetSquare) &&
            //     activePiece.type === "p"
            // if (isPromotionMove) {
            //     setTargetSquare(targetSquare)
            //     setIsPromoting(true)
            // } else {
            //     const mv = {
            //         from: activePiece.square,
            //         to: targetSquare,
            //     }
            //     dispatch(move(mv))
            //     if (isMovesSoundEnabled) {
            //         const chess = new Chess(fen)
            //         const validatedMove = chess.move(mv)
            //         playMoveSound(validatedMove, chess.isCheck())
            //     }
            //     await onMoveEnd?.(mv)
            // }
        }
    }

    function cancelPromotion() {
        setIsPromoting(false)
    }

    return {
        drag,
        drop,
        clickSquare,
        promote,
        isPromoting,
        squares,
        boardWidth,
        playerColor,
        cancelPromotion,
        lastMove,
        allowedSquares,
        pieces,
    }
}
