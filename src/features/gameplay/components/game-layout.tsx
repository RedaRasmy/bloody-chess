import { ReactNode } from "react";

export default function GameLayout({chessBoard,gameDetails,gameOverPopUp}:{
    chessBoard : ReactNode
    gameDetails : ReactNode
    gameOverPopUp : ReactNode
}) {

    return (
        <div className="flex landscape:flex-row portrait:flex-col w-full flex-1 xl:px-20 gap-3 lg:gap-5 xl:gap-8 h-full">
            {gameOverPopUp}
            <div className="flex-auto flex justify-center items-center ">
                {chessBoard}
            </div>
            {gameDetails}
        </div>
    )
}