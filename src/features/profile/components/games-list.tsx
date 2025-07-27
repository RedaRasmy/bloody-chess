import { type PlayedGame as PlayedGameType } from "../profile-types"
import PlayedGame from "./played-game"

export default function GamesList({ games }: { games: PlayedGameType[] }) {
    return (
        <div className="w-full bg-gray-100 rounded-lg px-4 lg:px-6 py-2 lg:py-3 portrait:h-4/6">
            <h1 className="text-2xl font-semibold mb-3 lg:mb-5 ml-3">
                Games History
            </h1>
            {games.length > 0 ? (
                <div className="flex flex-col gap-2 overflow-y-auto h-full px-3">
                    <div className="flex justify-between items-center">
                        <p className="font-bold">Color</p>
                        <p className="font-bold">Timer Option</p>
                        <p className="font-bold">Result</p>
                    </div>
                    {games.map((game) => (
                        <PlayedGame {...game} key={game.id} />
                    ))}
                </div>
            ) : (
                <h1 className="font-bold text-xl self-center align-center h-full">
                    No Games Played Yet!
                </h1>
            )}
        </div>
    )
}
