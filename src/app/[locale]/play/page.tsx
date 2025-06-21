
import Board from "@/features/gameplay/components/board"
import GameDetails from "@/features/gameplay/components/game-details"
import GameOverPopUp from "@/features/gameplay/components/game-over-pop-up"

export default function page() {
    return (
        <div className="flex landscape:flex-row portrait:flex-col w-full flex-1 xl:px-20 gap-3 lg:gap-5 xl:gap-8">
            <GameOverPopUp/>
            <div className=" flex-auto flex justify-center items-center ">
                <Board />
            </div>
            <GameDetails/>
        </div>
    )
}
