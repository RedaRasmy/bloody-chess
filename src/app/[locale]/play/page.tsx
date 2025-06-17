
import Board from "@/features/gameplay/components/board"
import GameDetails from "@/features/gameplay/components/game-details"
import GameOverPopUp from "@/features/gameplay/components/game-over-pop-up"

export default function page() {
    return (
        <div className="flex lg:flex-row flex-col w-full flex-1">
            <GameOverPopUp/>
            <div className="bg-gray-200 lg:w-[60%] not-lg:h-[60%] flex justify-center items-center">
                <Board />
            </div>
            <GameDetails/>
        </div>
    )
}
