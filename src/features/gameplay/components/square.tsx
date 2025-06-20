import { cn } from "@/lib/utils"
import { Chess, type Color, type Square } from "chess.js"
import { BoardElement,  } from "../types"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import {
    move,
    selectActivePiece,
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
    const activePiece = useAppSelector(selectActivePiece)
    const fen = useAppSelector(selectFEN)
    const playerColor = useAppSelector(selectPlayerColor)
    const isPromotionSquare =
        (playerColor === "w" && name.slice(1) === "8") ||
        (playerColor === "b" && name.slice(1) === "1")

    const [isOpen, setIsOpen] = useState(false)

    const chess = new Chess(fen)

    function handlePromotion(promotion: string) {
        if (!activePiece) return;
        const moveDetails = {from: activePiece.square , to : name as Square , promotion}
        dispatch(move(moveDetails))
        const theMove = chess.move(moveDetails)
        playMoveSound(theMove,chess.inCheck())
        setIsOpen(false)
    }



    async function handleClick() {
        if (!isPlayerTurn) return
        if (isToMove) {
            if (!activePiece)
                throw new Error(
                    "activePieceSquare shouldn't be undefined while isToMove is true "
                )

            if (isPromotionSquare && activePiece.type === 'p') {
                // open choose promotion piece
                setIsOpen(true)
            } else {
                dispatch(move({ from: activePiece.square, to: name as Square }))
                const theMove = chess.move({from:activePiece.square,to:name})
                playMoveSound(theMove,chess.inCheck())
            }
        } else {
            if (piece) dispatch(toMove(piece))
        }
    }

    return (
        <div
            className={cn("bg-amber-100 flex justify-center items-center relative", {
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


