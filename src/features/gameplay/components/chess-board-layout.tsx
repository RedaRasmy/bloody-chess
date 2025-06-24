import { Chess, Color, PieceSymbol, Square } from "chess.js"
import {
    BoardElement,
    CapturedPieces as CapturedPiecesType,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import CapturedPieces from "./captured-pieces"
import { restrictToWindowEdges, snapCenterToCursor } from "@dnd-kit/modifiers"
import { rank } from "../utils/rank-file"
import { promotionRank } from "../utils/promotion-rank"

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
}) {
    const chess = new Chess(fen)
    const board = chess.board().flat()

    const [isPromoting, setIsPromoting] = useState(false)
    const [targetSquare, setTargetSquare] = useState<Square | null>(null)
    const [activePiece, setActivePiece] = useState<BoardElement>(null)

    const opponentColor = playerColor === "w" ? "b" : "w"

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

        if (activePiece) {
            if (!allowedSquares) throw new Error("allowedSquares shouldn't be undefined while moving")

            if (!activePiece) throw new Error("activePiece shouldn't be null while moving")

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
        console.log("darg start")
        console.log("active : ", active)
        const piece = active.data.current as Exclude<BoardElement, null>
        onMoveStart(piece)
        setActivePiece(piece)

    }
    function handleDragEnd(event: DragEndEvent) {
        if (!activePiece) throw new Error("activePiece should be defined on drag end")
        if (!allowedSquares) throw new Error("on drag end allowedSquares should be defined")
        
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
            <div className="bg-gray-100 rounded-md flex items-center gap-2 px-2 py-1 h-fit w-full">
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>B</AvatarFallback>
                </Avatar>
                <p className="font-bold">{players.opponent.name}</p>
                <CapturedPieces
                    color={playerColor}
                    capturedPieces={capturedPieces[playerColor]}
                />
                {score < 0 && <p>+{-score}</p>}
            </div>
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

            <div className="bg-gray-100 rounded-md flex items-center gap-2 px-2 py-1 h-fit w-full">
                <Avatar className="">
                    <AvatarImage
                        src="https://github.com/shadcn.png"
                        className=""
                    />
                    <AvatarFallback>G</AvatarFallback>
                </Avatar>
                <p className="font-bold">{players.player.name} </p>
                <CapturedPieces
                    color={opponentColor}
                    capturedPieces={capturedPieces[opponentColor]}
                />
                {score > 0 && <p>+{score}</p>}
            </div>
        </div>
    )
}
