import { type PlayedGame as PlayedGameType } from "../profile-types"
import PlayedGame from "./played-game"

export default function GamesList({ games }: { games: PlayedGameType[] }) {
    return (
        <div className="border-1 border-black w-full">
            <h1>Games History</h1>
            <div className="flex flex-row gap-2">
                {games.map((game) => (
                    <PlayedGame {...game} key={game.id} />
                ))}
            </div>
        </div>
    )
}
