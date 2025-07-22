import useChessBoardWidth from "@/hooks/useChessBoardWidth"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { PieceSymbol, Square } from "chess.js"
import { useState } from "react"
import {
    selectActivePiece,
    selectLegalMoves,
    selectPlayerColor,
    selectIsPlayerTurn,selectLastMove,selectPieces
} from "@/redux/slices/game/game-selectors"
import getSquares from "../utils/get-squares"
import { BoardElement, MoveType } from "../types"
import { promotionRank } from "../utils/promotion-rank"
import { rank } from "../utils/rank-file"
import { move, select } from "@/redux/slices/game/game-slice"
import { DragEndEvent, DragStartEvent } from "@dnd-kit/core"

export default function useChessBoard() {
    const dispatch = useAppDispatch()
    const activePiece = useAppSelector(selectActivePiece)
    const legalMoves = useAppSelector(selectLegalMoves)
    const playerColor = useAppSelector(selectPlayerColor)
    const isPlayerTurn = useAppSelector(selectIsPlayerTurn)
    const lastMove = useAppSelector(selectLastMove)
    const pieces = useAppSelector(selectPieces)

    const [isPromoting, setIsPromoting] = useState(false)
    const [targetSquare, setTargetSquare] = useState<Square | null>(null)
    const boardWidth = useChessBoardWidth()
    const allowedSquares = activePiece
        ? legalMoves[activePiece.square]?.map((mv) => mv.to) ?? []
        : []

    const squares = getSquares(playerColor === "b")

    function promote(promotion: string) {
        if (!activePiece || !targetSquare) return

        dispatch(
            move({
                from: activePiece.square,
                to: targetSquare,
                promotion: promotion as PieceSymbol,
            })
        )
        setIsPromoting(false)
        setTargetSquare(null)

    }

    function clickSquare(square: Square) {
        // clicking a square should only : cancel a move or play a move

        if (activePiece && allowedSquares.length > 0) {
            if (allowedSquares.includes(square)) {
                const isPromotionMove =
                    promotionRank(playerColor) === rank(square) &&
                    activePiece.type === "p"
                if (isPromotionMove) {
                    setTargetSquare(square)
                    setIsPromoting(true)
                } else {
                    dispatch(
                        move({
                            from: activePiece.square,
                            to: square,
                        })
                    )
                }
            } else {
                // cancel move , active piece should return to null
            }
        }
    }

    function drag(event: DragStartEvent) {
        const { active } = event
        const piece = active.data.current as Exclude<BoardElement, null>
        /// prevent unnecesasry calculations :
        // if not a player's piece
        if (piece.color !== playerColor) return
        // if it's the same piece
        // if (piece.square === activePiece?.square) {
        //     return
        // }
        dispatch(select(piece))
    }

    function drop(event: DragEndEvent) {
        if (!activePiece) return

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
                    dispatch(
                        move({
                            from: activePiece.square,
                            to: targetSquare,
                        })
                    )
                }
            }
        } else {
            const isPromotionMove =
                promotionRank(playerColor) === rank(targetSquare) &&
                activePiece.type === "p"
            if (isPromotionMove) {
                setTargetSquare(targetSquare)
                setIsPromoting(true)
            } else {
                dispatch(
                    move({
                        from: activePiece.square,
                        to: targetSquare,
                    })
                )
            }
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
        pieces
    }
}
