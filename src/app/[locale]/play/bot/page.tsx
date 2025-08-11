"use client"
import BotController from "@/features/bot/components/bot-controller"
import GameLayout from "@/features/gameplay/components/game-layout"
import PlayerSection from "@/features/gameplay/components/player-section"
import ChessBoard from "@/features/gameplay/components/chess-board"
import ChessBoardLayout from "@/features/gameplay/components/chess-board-layout"
import { oppositeColor } from "@/features/gameplay/utils/opposite-color"
import { playMoveSound } from "@/features/gameplay/utils/play-move-sound"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { selectBotOptions } from "@/redux/slices/game-options"
import {
    selectFEN,
    selectIsGameOver,
    selectIsPlayerTurn,
    selectPlayerColor,
} from "@/redux/slices/game/game-selectors"
import useBot from "@/features/bot/hooks/use-bot"
import { move } from "@/redux/slices/game/game-slice"
import BotGameOverDialog from "@/features/bot/components/bot-gameover-dialog"
import { selectIsMovesAudioEnabled } from "@/redux/slices/settings/settings-selectors"

export default function Page() {
    const dispatch = useAppDispatch()
    const playerColor = useAppSelector(selectPlayerColor)
    const fen = useAppSelector(selectFEN)
    const { level } = useAppSelector(selectBotOptions)
    const isGameOver = useAppSelector(selectIsGameOver)
    const isPlayerTurn = useAppSelector(selectIsPlayerTurn)

    const movesSoundsEnabled = useAppSelector(selectIsMovesAudioEnabled)

    const opponentColor = oppositeColor(playerColor)

    useBot({
        fen,
        isBotTurn: !isGameOver && !isPlayerTurn,
        level,
        onMove: (botMove, isCheck) => {
            dispatch(
                move({
                    from: botMove.from,
                    to: botMove.to,
                    promotion: botMove.promotion,
                })
            )
            if (movesSoundsEnabled) {
                playMoveSound(botMove, isCheck)
            }
        },
    })

    return (
        <GameLayout
            chessBoard={
                <ChessBoardLayout
                    OpponentSection={<PlayerSection color={opponentColor} />}
                    ChessBoard={<ChessBoard />}
                    PlayerSection={<PlayerSection color={playerColor} />}
                />
            }
            gameDetails={<BotController />}
            gameOverPopUp={<BotGameOverDialog />}
        />
    )
}
