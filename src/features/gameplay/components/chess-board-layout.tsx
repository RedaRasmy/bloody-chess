import { Chess, Color, PieceSymbol, Square } from "chess.js"
import {
    BoardElement,
    CapturedPieces as CapturedPiecesType,
    ChessTimer,
    MoveType,
    PlayersData,
} from "../types"
import SelectPromotion from "./select-promotion"
import { DndContext, DragEndEvent, DragStartEvent } from "@dnd-kit/core"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { indexToSquare } from "../utils/index-to-square"
import ChessBoardSquare from "./chess-board-square"
import { getSquareColor } from "../utils/get-square-color"
import { restrictToWindowEdges, snapCenterToCursor } from "@dnd-kit/modifiers"
import { rank } from "../utils/rank-file"
import { promotionRank } from "../utils/promotion-rank"
import PlayerSection from "./player-section"
import { oppositeColor } from "../utils/opposite-color"

export default function ChessBoardLayout({
    fen,
    onMoveEnd,
    playerColor,
    allowedSquares,
    lastMove,
    capturedPieces,
    score,
    players,
    onMoveStart,
    onMoveCancel,
    // timer
}: {
    fen: string
    onMoveEnd: (move: MoveType) => void
    playerColor: Color
    allowedSquares : Square[] | undefined
    lastMove?: { from: Square; to: Square }
    capturedPieces: CapturedPiecesType
    score: number
    players: PlayersData
    onMoveStart: (piece: Exclude<BoardElement, null>) => void
    onMoveCancel: () => void
    timer?: ChessTimer
}) {
    const chess = new Chess(fen)
    const board = chess.board().flat()

    const [isPromoting, setIsPromoting] = useState(false)
    const [targetSquare, setTargetSquare] = useState<Square | null>(null)
    const [activePiece, setActivePiece] = useState<BoardElement>(null)

    const opponentColor = oppositeColor(playerColor)

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

    function handleSquareClick(square: Square) {
        // clicking a square should only : cancel a move or play a move

        if (activePiece && allowedSquares) {

            if (allowedSquares.includes(square)) {
                const isPromotionMove = (promotionRank(playerColor) === rank(square)) && (activePiece.type === 'p')
                if (isPromotionMove) {
                    setTargetSquare(square)
                    setIsPromoting(true)
                } else {
                    onMoveEnd({
                        from : activePiece.square,
                        to : square
                    })
                }
            } else { 
                onMoveCancel()
            }
        }
    }

    function handleDragStart(event: DragStartEvent) {
        const { active } = event
        const piece = active.data.current as Exclude<BoardElement, null>
        onMoveStart(piece)
        setActivePiece(piece)

    }
    function handleDragEnd(event: DragEndEvent) {

        if (!activePiece || !allowedSquares) return;
        
        const {over} = event
        
        if (!over || over.id === activePiece.square) return;
        const targetSquare = over.id as Square

        if (allowedSquares.includes(targetSquare)) {
            onMoveEnd({
                from : activePiece.square,
                to : targetSquare
            })
        }
    }

    return (
        <div className="flex flex-col w-full max-w-[75vh] gap-1">
            <PlayerSection
                opponentColor={playerColor}
                capturedPieces={capturedPieces[playerColor]}
                username={players.opponent.name}
                image={players.opponent.image}
                score={score < 0 ? -score : 0}
                remainingTime={null}
            />
            <div className="relative w-full h-full">
                <SelectPromotion
                    onChange={handlePromotion}
                    color={playerColor}
                    open={isPromoting}
                    onClickOutside={() => setIsPromoting(false)}
                />
                <DndContext
                    modifiers={[restrictToWindowEdges,snapCenterToCursor]}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
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
                                    isToMove={
                                        allowedSquares
                                            ? allowedSquares.includes(
                                                  name
                                              )
                                            : false
                                    }
                                    isLastMove={
                                        !!lastMove &&
                                        (lastMove.from == name ||
                                            lastMove.to == name)
                                    }
                                    onClick={handleSquareClick}
                                ></ChessBoardSquare>
                            )
                        })}
                    </div>
                </DndContext>
            </div>
            <PlayerSection
                opponentColor={opponentColor}
                capturedPieces={capturedPieces[opponentColor]}
                username={players.player.name}
                image={players.player.image}
                score={score > 0 ? score : 0}
                remainingTime={null}
            />
        </div>
    )
}
