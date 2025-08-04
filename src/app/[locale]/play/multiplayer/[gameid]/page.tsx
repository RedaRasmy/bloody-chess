"use client"
import ChessBoardLayout from "@/features/gameplay/components/chess-board-layout"
import GameLayout from "@/features/gameplay/components/game-layout"
import PlayerSection from "@/features/gameplay/components/player-section"
import { useMultiplayerGame } from "@/features/multiplayer/hooks/use-multiplayer-game"
import { useParams } from "next/navigation"
import { oppositeColor } from "@/features/gameplay/utils/opposite-color"
import ChessBoard from "@/features/gameplay/components/chess-board"
import MultiplayerController from "@/features/multiplayer/components/multiplayer-controller"
import SetupLoading from "@/features/multiplayer/components/setup-loading"
import MultiplayerGameOverDialog from "@/features/multiplayer/components/multiplayer-gameover-dialog"
import DrawDialog from "@/features/multiplayer/components/draw-dialog"
import RematchDialog from "@/features/multiplayer/components/rematch-dialog"

export default function Page() {
    const params = useParams()
    const gameId = params.gameid as string
    const {
        move,
        playerColor,
        isSetuping,
        resign,
        timeOut,
        isOpponentOffersDraw,
        isOpponentOffersRematch,
        rejectDraw,
        rejectRematch,
        draw,
        rematch,
        sendDrawOffer,
        sendRematchOffer,
    } = useMultiplayerGame(gameId)

    const opponentColor = oppositeColor(playerColor)

    if (isSetuping) return <SetupLoading />

    return (
        <>
            <GameLayout
                chessBoard={
                    <ChessBoardLayout
                        OpponentSection={
                            <PlayerSection
                                color={opponentColor}
                                onTimeOut={timeOut}
                            />
                        }
                        ChessBoard={<ChessBoard onMoveEnd={move} />}
                        PlayerSection={<PlayerSection color={playerColor} />}
                    />
                }
                gameDetails={
                    <MultiplayerController
                        onResign={resign}
                        onDrawOffer={sendDrawOffer}
                        onRematchOffer={sendRematchOffer}
                    />
                }
                gameOverPopUp={<MultiplayerGameOverDialog onRematch={sendRematchOffer} />}
            />
            <DrawDialog
                onAccept={draw}
                onReject={rejectDraw}
                isOpen={isOpponentOffersDraw}
            />
            <RematchDialog
                onAccept={rematch}
                onReject={rejectRematch}
                isOpen={isOpponentOffersRematch}
            />
        </>
    )
}
