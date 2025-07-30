import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Color } from "chess.js"
import React from "react"
import CapturedPieces from "./captured-pieces"
import Timer from "./timer"
import { oppositeColor } from "../utils/opposite-color"
import { useAppSelector } from "@/redux/hooks"
import {
    selectWhitePlayer,
    selectBlackPlayer,
} from "@/redux/slices/game/game-selectors"

export default function PlayerSection({
    color,
    onTimeOut,
}: {
    color: Color
    onTimeOut?: (color: Color) => Promise<void>
}) {
    const { name, extraPoints, timeLeft, capturedPieces } = useAppSelector(
        color === "w" ? selectWhitePlayer : selectBlackPlayer
    )

    const image = undefined // for now

    return (
        <div className="bg-gray-100 rounded-md flex items-center justify-between gap-2 px-2 py-1 h-fit w-full">
            <div className="flex items-center gap-2">
                <Avatar className="border-2 border-gray-300">
                    <AvatarImage src={image ?? "/images/default-avatar.jpg"} />
                    <AvatarFallback>B</AvatarFallback>
                </Avatar>
                <p className="font-bold">{name}</p>
                <CapturedPieces
                    color={oppositeColor(color)}
                    capturedPieces={capturedPieces}
                />
                {extraPoints > 0 && <p>+{extraPoints}</p>}
            </div>
            <div>
                {timeLeft !== null && (
                    <Timer
                        playerColor={color}
                        onTimeOut={onTimeOut}
                    />
                )}
            </div>
        </div>
    )
}
