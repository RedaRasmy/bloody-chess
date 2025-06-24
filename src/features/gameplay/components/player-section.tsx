import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Color } from "chess.js"
import React from "react"
import { CapturedPieces as CapturedPiecesType } from "../types"
import CapturedPieces from "./captured-pieces"
import Timer from "./timer"

export default function PlayerSection({
    score,
    username,
    image,
    opponentColor,
    capturedPieces,
    remainingTime 
}:{
    score : number
    username : string
    opponentColor : Color
    capturedPieces : CapturedPiecesType['w']
    remainingTime : number | null
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
                    remainingTime !== null && <Timer duration={remainingTime} />
                }
            </div>
        </div>
    )
}
