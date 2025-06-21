"use client"
import ChessBoard from "./chess-board"

export default function Board() {

    return (
        <div className="flex flex-col w-full h-full gap-2 items-center justify-center">
            <div className="flex flex-col w-full max-w-[80vh] gap-2">
                <div className="border-1 border-black  bg-amber-200 h-fit w-full"> 
                </div>
                    <ChessBoard/>
                <div className="border-1 border-black  bg-amber-200 h-fit w-full">
                </div>
            </div>
        </div>
    )
}


