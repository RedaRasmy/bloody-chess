import { type PlayedGame as PlayedGameType } from "../profile-types"
import PlayedGame from "./played-game"

export default function GamesList({ games }: { games: PlayedGameType[] }) {
    return (
        <div className="w-full bg-gray-600 rounded-lg px-1 lg:px-6 py-2 lg:py-5 flex flex-col portrait:h-4/6 text-white">
            <h1 className="text-2xl font-semibold ml-3 h-1/10 ">
                Games History
            </h1>
            {games.length > 0 ? (
                <div className="flex flex-col gap-2 px-3 h-9/10">
                    <div className="flex justify-between items-center h-1/8">
                        <p className="font-bold">Color</p>
                        <p className="font-bold">Timer Option</p>
                        <p className="font-bold">Result</p>
                    </div>
                    <div className="overflow-y-auto h-7/8 flex flex-col gap-2">
                        {games.map((game) => (
                            <PlayedGame {...game} key={game.id} />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="h-7/8 flex justify-center items-center">
                    <h1 className="font-bold text-xl ">No Games Played Yet!</h1>
                </div>
            )}
        </div>
    )
}

// const example: PlayedGameType[] = [
//     {
//         id: "1",
//         color: "w",
//         result: "win",
//         timerOption: "blitz 3+0",
//     },
//     {
//         id: "2",
//         color: "b",
//         result: "win",
//         timerOption: "rapid 10+0",
//     },
//     {
//         id: "3",
//         color: "w",
//         result: "lose",
//         timerOption: "blitz 3+0",
//     },
//     {
//         id: "4",
//         color: "w",
//         result: "win",
//         timerOption: "blitz 3+0",
//     },
//     {
//         id: "5",
//         color: "b",
//         result: "win",
//         timerOption: "rapid 10+0",
//     },
//     {
//         id: "6",
//         color: "w",
//         result: "lose",
//         timerOption: "blitz 3+0",
//     },
//     {
//         id: "7",
//         color: "w",
//         result: "win",
//         timerOption: "blitz 3+0",
//     },
//     {
//         id: "8",
//         color: "b",
//         result: "win",
//         timerOption: "rapid 10+0",
//     },
//     {
//         id: "9",
//         color: "w",
//         result: "lose",
//         timerOption: "blitz 3+0",
//     },
//     {
//         id: "10",
//         color: "w",
//         result: "win",
//         timerOption: "blitz 3+0",
//     },
//     {
//         id: "11",
//         color: "b",
//         result: "win",
//         timerOption: "rapid 10+0",
//     },
//     {
//         id: "12",
//         color: "w",
//         result: "lose",
//         timerOption: "blitz 3+0",
//     },
// ]
