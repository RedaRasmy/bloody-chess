"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ChessBoard from "./chess-board"
import { useAppSelector } from "@/redux/hooks"
import { selectBotOptions } from "@/redux/slices/game-options"
import CapturedPieces from "./captured-pieces"
import { selectPlayerColor, selectScore } from "@/redux/slices/game-slice"

export default function Board() {
    const {level} = useAppSelector(selectBotOptions)
    const playerColor = useAppSelector(selectPlayerColor)
    const score = useAppSelector(selectScore)
    const opponentColor = (playerColor==='w') ? 'b' : 'w'
    return (
        // <div className="w-full">
            <div className="flex flex-col w-full max-w-[75vh] gap-1">
                <div className="bg-gray-100 rounded-md flex items-center gap-2 px-2 py-1 h-fit w-full">
                    <Avatar >
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>B</AvatarFallback>
                    </Avatar>
                    <p className="font-bold">BOT <span className="text-red-600 ">-lvl{level}-</span></p>
                    <CapturedPieces color={playerColor} />
                    {score < 0 && <p>+{-score}</p>}
                </div>
                <ChessBoard />
                <div className="bg-gray-100 rounded-md flex items-center gap-2 px-2 py-1 h-fit w-full">
                    <Avatar className="">
                        <AvatarImage src="https://github.com/shadcn.png" className="" />
                        <AvatarFallback>G</AvatarFallback>
                    </Avatar>
                    <p className="font-bold">Guest </p>
                    <CapturedPieces color={opponentColor} />
                    {score > 0 && <p>+{score}</p>}
                </div>
            </div>
        // </div>
    )
}
