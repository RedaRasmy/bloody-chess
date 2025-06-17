import { cn } from "@/lib/utils"
import { Chess, type Color, type Square } from "chess.js"
import { getPieceName } from "../utils/getPieceName"
import Image from "next/image"
import { BoardElement } from "../types"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import {
    move,
    selectActivePieceSquare,
    selectFEN,
    selectIsPlayerTurn,
    selectPlayerColor,
    toMove,
} from "@/redux/slices/game-slice"
import playSound from "../utils/play-sound"

export default function Square({
    name,
    color,
    piece,
    isToMove = false,
}: {
    name: string
    color: Color
    piece: BoardElement
    isToMove?: boolean
}) {
    const dispatch = useAppDispatch()
    const isPlayerTurn = useAppSelector(selectIsPlayerTurn)
    const activePieceSquare = useAppSelector(selectActivePieceSquare)
    const fen = useAppSelector(selectFEN)

    const chess = new Chess(fen)

    
    async function handleClick() {
        if (!isPlayerTurn) return;
        if (isToMove) {
            if (!activePieceSquare) throw new Error("activePieceSquare shouldn't be undefined while isToMove is true ")
            dispatch(move({from:activePieceSquare,to:name as Square}))
            const theMove = chess.move({from:activePieceSquare,to:name as Square})
            if (theMove.isCapture()) {
                playSound("capture")
            } else {
                playSound("move")

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
            })}
            onClick={handleClick}
        >
            {piece && <Piece type={piece.type} color={piece.color} />}
            {isToMove && (
                <div className="md:size-7 size-5 bg-gray-500/60 rounded-full z-10 absolute" />
            )}
        </div>
    )
}

function Piece({
    type,
    color,
}: {
    type: string // example : p , n , ...
    color: "w" | "b"
}) {
    /// black is uppercase , white is lowercase
    const colorName = color == "b" ? "black" : "white"
    const name = getPieceName(type)
    const playerColor = useAppSelector(selectPlayerColor)


    return (
        <Image
            alt={type}
            width={55}
            height={55}
            src={`/images/chess-pieces/${colorName}-${name}.png`}
            className={cn("cursor-pointer",{
                'rotate-180' : playerColor === 'b'
            })}
        />
    )
}
