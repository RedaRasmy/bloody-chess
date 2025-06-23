import { Chess, Color, PieceSymbol, Square } from "chess.js"
import {
    BoardElement,
    CapturedPieces as CapturedPiecesType,
    MoveType,
    PlayersData,
} from "../types"
import SelectPromotion from "./select-promotion"
import { DndContext } from "@dnd-kit/core"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { indexToSquare } from "../utils/index-to-square"
import ChessBoardSquare from "./chess-board-square"
import { getSquareColor } from "../utils/get-square-color"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import CapturedPieces from "./captured-pieces"
import { restrictToWindowEdges } from '@dnd-kit/modifiers'

export default function ChessBoardLayout({
    // dump
    fen,
    onMoveEnd,
    playerColor,
    moving,
    lastMove,
    capturedPieces,
    score,
    players,
    onMoveStart,
    activePiece,
    onMoveCancel,
}: {
    fen: string
    onMoveEnd: (move: MoveType) => void
    playerColor: Color
    moving:
        | {
              isMoving: true
              allowedSquares: Square[]
          }
        | {
              isMoving: false
          }
    lastMove?: { from: Square; to: Square }
    capturedPieces: CapturedPiecesType
    score: number
    players: PlayersData
    onMoveStart: (piece: Exclude<BoardElement, null>) => void
    activePiece: BoardElement
    onMoveCancel: () => void
}) {
    const chess = new Chess(fen)
    const board = chess.board().flat()

    const [isPromoting, setIsPromoting] = useState(false)
    const [targetSquare, setTargetSquare] = useState<Square | null>(null)
    // const [activePiece, setActivePiece] = useState<BoardElement>(null)

    const promotionRank = playerColor === "w" ? "8" : "1"

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

    function handleSquareClick(square: Square, piece: BoardElement) {
        if (moving.isMoving) {
            console.log('already moving')
            if (!activePiece)
                throw new Error("Active piece shouldn't be null while moving")

            if (!moving.allowedSquares.includes(square)) {
                // if clicked in no-to-move square
                if (!piece || piece.color !== playerColor) {
                    onMoveCancel()
                } else {
                    onMoveStart(piece)
                }
            } else {
                const isPromotionSquare = promotionRank === square.slice(1)

                if (isPromotionSquare && activePiece.type === "p") {
                    setTargetSquare(square)
                    setIsPromoting(true)
                } else {
                    onMoveEnd({
                        from: activePiece.square,
                        to: square,
                    })
                }
            }
        } else {
            console.log('start moving')
            if (piece) onMoveStart(piece)
            // if there is no piece then the player clicked empty square => nothing will happen
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
                    modifiers={[restrictToWindowEdges]}
                    onDragStart={({ active }) => {
                        console.log('darg start')
                        console.log("active : ",active)
                        const square = active.id as Square
                        const piece = active.data.current as Exclude<
                            BoardElement,
                            null
                        >
                        handleSquareClick(square, piece)
                    }}
                    onDragEnd={({ over }) => {
                        // u sheck if it ended over target or not
                        // if there yes so do : over.id? to know target square
                        if (over) {
                            const square = over.id as Square
                            const piece = over.data.current as Exclude<
                                BoardElement,
                                null
                            >
                            handleSquareClick(square, piece)
                        }
                    }}
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
                                        moving.isMoving
                                            ? moving.allowedSquares.includes(
                                                  name
                                              )
                                            : false
                                    }
                                    isLastMove={
                                        !!lastMove &&
                                        (lastMove.from == name ||
                                            lastMove.to == name)
                                    }
                                    onClick={()=>{}}
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
