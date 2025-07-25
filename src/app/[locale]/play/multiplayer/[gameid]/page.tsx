"use client"
import ChessBoardLayout from "@/features/gameplay/components/chess-board-layout"
import GameDetails from "@/features/gameplay/components/game-details"
import GameLayout from "@/features/gameplay/components/game-layout"
import GameOverPopUp from "@/features/gameplay/components/game-over-pop-up"
import PlayerSection from "@/features/gameplay/components/player-section"
import { useMultiplayerGame } from "@/features/gameplay/hooks/use-multiplayer-game"
import { useParams } from "next/navigation"
import { oppositeColor } from "@/features/gameplay/utils/opposite-color"
import ChessBoard from "@/features/gameplay/components/chess-board"

export default function Page() {
    const params = useParams()
    const gameId = params.gameid as string
    const {
        move,
        playerColor,
        isSetuping
    } = useMultiplayerGame(gameId)

    const opponentColor = oppositeColor(playerColor)

    if (isSetuping) return <div>loading...</div>

    return (
        <GameLayout
            chessBoard={
                <ChessBoardLayout
                    OpponentSection={<PlayerSection color={opponentColor} />}
                    ChessBoard={<ChessBoard
                        onMoveEnd={move}
                        />}
                    PlayerSection={<PlayerSection color={playerColor} />}
                />
            }
            gameDetails={<GameDetails />}
            gameOverPopUp={<GameOverPopUp />}
        />
    )
}
