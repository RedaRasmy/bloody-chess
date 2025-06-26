import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Color } from "chess.js"
import React from "react"
import { CapturedPieces as CapturedPiecesType, ChessTimer } from "../types"
import CapturedPieces from "./captured-pieces"
import Timer from "./timer"
import { oppositeColor } from "../utils/opposite-color"

export default function PlayerSection({
    score,
    username,
    image,
    opponentColor,
    capturedPieces,
    timer 
}:{
    score : number
    username : string
    opponentColor : Color
    capturedPieces : CapturedPiecesType['w']
    timer?: ChessTimer
    image?: string
}) {
    
    return (
        <div className="bg-gray-100 rounded-md flex items-center justify-between gap-2 px-2 py-1 h-fit w-full">
            <div className="flex items-center gap-2">
                <Avatar className="border-2 border-gray-300">
                    <AvatarImage src={image ?? "/images/default-avatar.jpg"} />
                    <AvatarFallback>B</AvatarFallback>
                </Avatar>
                <p className="font-bold">{username}</p>
                <CapturedPieces
                    color={opponentColor}
                    capturedPieces={capturedPieces}
                />
                {score > 0 && <p>+{score}</p>}
            </div>
            <div>
                {
                    timer && <Timer duration={timer.base} plus={timer.plus} player={oppositeColor(opponentColor)} />
                }
            </div>
        </div>
    )
}
