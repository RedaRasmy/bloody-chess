import { cn } from "@/lib/utils"
import { Chess, type Color, type Square } from "chess.js"
import { BoardElement,  } from "../types"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import {
    move,
    selectActivePieceSquare,
    selectFEN,
    selectIsPlayerTurn,
    selectPlayerColor,
    toMove,
} from "@/redux/slices/game-slice"
import SelectPromotion from "./select-promotion"
import { useState } from "react"
import { Piece } from "./piece"
import { playMoveSound } from "../utils/play-move-sound"

export default function Square({
    name,
    color,
    piece,
    isToMove = false,
    isLastMove 
}: {
    name: string
    color: Color
    piece: BoardElement
    isToMove?: boolean
    isLastMove : boolean
}) {
    const dispatch = useAppDispatch()
    const isPlayerTurn = useAppSelector(selectIsPlayerTurn)
    const activePieceSquare = useAppSelector(selectActivePieceSquare)
    const fen = useAppSelector(selectFEN)
    const playerColor = useAppSelector(selectPlayerColor)
    const isPromotionSquare =
        (playerColor === "w" && name.slice(1) === "8") ||
        (playerColor === "b" && name.slice(1) === "1")

    // const [, setPromotionPiece] = useState<null | PromotionPiece>(null)
    const [isOpen, setIsOpen] = useState(false)

    const chess = new Chess(fen)

    function handlePromotion(promotion: string) {
        if (!activePieceSquare) return;
        const moveDetails = {from:activePieceSquare , to : name as Square , promotion}
        dispatch(move(moveDetails))
        const theMove = chess.move(moveDetails)
        playMoveSound(theMove,chess.inCheck())
        setIsOpen(false)
    }



    async function handleClick() {
        console.log('square clicked')
        if (!isPlayerTurn) return
        if (isToMove) {
            console.log('is to move square')
            if (!activePieceSquare)
                throw new Error(
                    "activePieceSquare shouldn't be undefined while isToMove is true "
                )

            if (isPromotionSquare) {
                // open choose promotion piece
                setIsOpen(true)
            } else {
                dispatch(move({ from: activePieceSquare, to: name as Square }))
                const theMove = chess.move({from:activePieceSquare,to:name})
                playMoveSound(theMove,chess.inCheck())
            }
        } else {
            if (piece) dispatch(toMove(piece.square))
        }
    }

    return (
        <div
            className={cn("bg-amber-100 flex justify-center items-center", {
                "bg-amber-100": color === "w",
                "bg-red-700": color === "b",
                "bg-amber-400" : isLastMove && color == 'w' ,
                "bg-amber-300" : isLastMove && color == 'b' ,
            })}
            onClick={handleClick}
        >
            {(isPromotionSquare) && (
                <SelectPromotion
                    onChange={handlePromotion}
                    color={playerColor}
                    open={isOpen}
                    onOpenChange={open=>setIsOpen(open)}
                />
            )}
            {piece && <Piece type={piece.type} color={piece.color} />}
            {isToMove && (
                <div className="md:size-7 size-5 bg-gray-500/60 rounded-full z-10 absolute" />
            )}
        </div>
    )
}


