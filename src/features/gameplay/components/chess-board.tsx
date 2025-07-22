import { DndContext, DragEndEvent, DragStartEvent } from "@dnd-kit/core"
import { PieceSymbol, Square } from "chess.js"
import ChessSquare from "./chess-square"
import { BoardElement, LegalMoves, MoveType, Piece } from "../types"
import Droppable from "./droppable"
import { useState } from "react"
import SelectPromotion from "./select-promotion"
import { promotionRank } from "../utils/promotion-rank"
import { rank } from "../utils/rank-file"
import { restrictToWindowEdges, snapCenterToCursor } from "@dnd-kit/modifiers"
import { cn } from "@/lib/utils"
import dynamic from "next/dynamic"
import useChessBoardWidth from "@/hooks/useChessBoardWidth"
import getSquares from "../utils/get-squares"
import { useAppSelector } from "@/redux/hooks"
const ChessPiece = dynamic(() => import("./chess-piece"))
import {selectAnimationSetting} from '@/redux/slices/settings'

export default function ChessBoard({
    pieces,
    playerColor,
    onMoveStart,
    onMoveEnd,
    onMoveCancel,
    legalMoves,
    lastMove,
    preMoves=[],
    isPlayerTurn,
    activePiece,
}: {
    activePiece : BoardElement
    pieces: Piece[]
    playerColor: "w" | "b"
    onMoveStart: (piece: Exclude<BoardElement, null>) => void
    onMoveCancel?: () => void
    onMoveEnd: (move: MoveType) => void
    lastMove?: MoveType | undefined
    legalMoves : LegalMoves
    preMoves?: MoveType[]
    isPlayerTurn: boolean,
}) {
    const {enabled:animatedMoves,durationMs} = useAppSelector((selectAnimationSetting('moves')))
    const [isPromoting, setIsPromoting] = useState(false)
    const [targetSquare, setTargetSquare] = useState<Square | null>(null)
    const allowedSquares = activePiece ? legalMoves[activePiece.square]?.map(mv=>mv.to) ?? [] : []


    const squares = getSquares(playerColor === "b")

    function handlePromotion(promotion: string) {
        if (!activePiece || !targetSquare) return
        onMoveEnd({
            from: activePiece.square,
            to: targetSquare,
            promotion: promotion as PieceSymbol,
        })
        setIsPromoting(false)
        setTargetSquare(null)
    }

    function handleClick(square: Square) {
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
                    onMoveEnd({
                        from: activePiece.square,
                        to: square,
                    })
                }
            } else {
                onMoveCancel?.()
            }
        }
    }

    const boardWidth = useChessBoardWidth()

    function handleDragStart(event: DragStartEvent) {
        const { active } = event
        const piece = active.data.current as Exclude<BoardElement, null>
        /// prevent unnecesasry calculations :
        // if not a player's piece
        if (piece.color !== playerColor) return
        // if it's the same piece
        // if (piece.square === activePiece?.square) {
        //     return
        // }
        onMoveStart(piece)
    }

    function handleDragEnd(event: DragEndEvent) {
        if (!activePiece) return;

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
                    onMoveEnd({
                        from: activePiece.square,
                        to: targetSquare,
                    })
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
                onMoveEnd({
                    from: activePiece.square,
                    to: targetSquare,
                })
            }
        }
    }

    return (
        <DndContext
            modifiers={[restrictToWindowEdges, snapCenterToCursor]}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div
                id="chess-board"
                className={cn(
                    "relative grid grid-cols-8 grid-rows-8 aspect-square"
                )}
            >
                <SelectPromotion
                    onChange={handlePromotion}
                    color={playerColor}
                    open={isPromoting}
                    onClickOutside={() => setIsPromoting(false)}
                />
                {squares.map((sq) => (
                    <Droppable key={sq} id={sq}>
                        <ChessSquare
                            squareName={sq}
                            isLastMove={
                                !!lastMove &&
                                (lastMove.from === sq || lastMove.to === sq)
                            }
                            isPreMove={
                                !!preMoves.find(
                                    (mv) => mv.from === sq || mv.to === sq
                                )
                            }
                            isTarget={allowedSquares.includes(sq)}
                            onClick={handleClick}
                        />
                    </Droppable>
                ))}
                {pieces.map((piece) => {
                    if (piece && boardWidth) {
                        return (
                            <ChessPiece
                                animated={animatedMoves}
                                durationMs={durationMs}
                                reversed={playerColor === "b"}
                                boardWidth={boardWidth}
                                key={piece.id}
                                data={piece}
                            />
                        )
                    }
                })}
            </div>
        </DndContext>
    )
}
