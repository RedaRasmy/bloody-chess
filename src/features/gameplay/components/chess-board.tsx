import { DndContext, DragEndEvent, DragStartEvent } from "@dnd-kit/core"
import { PieceSymbol, Square } from "chess.js"
import ChessSquare from "./chess-square"
import { BoardElement, MoveType, Piece } from "../types"
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
const Draggable = dynamic(() => import("./draggable"))
const ChessPiece = dynamic(() => import("./chess-piece"))

export default function ChessBoard({
    pieces,
    playerColor,
    onMoveStart,
    onMoveEnd,
    onMoveCancel,
    allowedSquares,
    lastMove,
}: // preMoves,
{
    pieces: Piece[]
    playerColor: "w" | "b"
    onMoveStart: (piece: Exclude<BoardElement, null>) => void
    onMoveCancel: () => void
    onMoveEnd: (move: MoveType) => void
    allowedSquares: Square[]
    lastMove: MoveType | undefined
    preMoves: MoveType[]
}) {
    const [isPromoting, setIsPromoting] = useState(false)
    const [targetSquare, setTargetSquare] = useState<Square | null>(null)
    const [activePiece, setActivePiece] = useState<BoardElement>(null)

    const squares = getSquares()

    function handlePromotion(promotion: string) {
        if (!activePiece || !targetSquare) return
        onMoveEnd({
            from: activePiece.square,
            to: targetSquare,
            promotion: promotion as PieceSymbol,
        })
        setIsPromoting(false)
        setTargetSquare(null)
        setActivePiece(null)
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
                setActivePiece(null)
                onMoveCancel()
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
        setActivePiece(piece)
    }

    function handleDragEnd(event: DragEndEvent) {
        if (!activePiece || !allowedSquares) return

        const { over } = event

        if (!over || over.id === activePiece.square) return
        const targetSquare = over.id as Square

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
                setActivePiece(null)
            }
        } else {
            setActivePiece(null)
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
                    "relative grid grid-cols-8 grid-rows-8 aspect-square",
                    {
                        // "rotate-180": playerColor === "b",
                    }
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
                            isPreMove={false}
                            isTarget={allowedSquares.includes(sq)}
                            onClick={handleClick}
                        />
                    </Droppable>
                ))}
                {pieces.map((piece) => {
                    if (piece && boardWidth) {
                        return (
                            <Draggable
                                isReversed={playerColor==='b'}
                                boardWidth={boardWidth}
                                square={piece.square}
                                key={piece.id}
                                data={piece}
                            >
                                <ChessPiece
                                    piece={piece}
                                    boardWidth={boardWidth}
                                />
                            </Draggable>
                        )
                    }
                })}
            </div>
        </DndContext>
    )
}
