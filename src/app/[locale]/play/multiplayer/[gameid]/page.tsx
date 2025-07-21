import ChessBoardLayout from "@/features/gameplay/components/chess-board-layout"
import GameDetails from "@/features/gameplay/components/game-details"
import GameLayout from "@/features/gameplay/components/game-layout"
import GameOverPopUp from "@/features/gameplay/components/game-over-pop-up"
import PlayerSection from "@/features/gameplay/components/player-section"
import { useMultiplayerGame } from "@/features/gameplay/hooks/use-multiplayer-game"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { useParams } from "next/navigation"
import {selectShouldAnimate} from '@/redux/slices/settings'
import { parseTimer } from "@/features/gameplay/utils/parse-timer"
import { oppositeColor } from "@/features/gameplay/utils/opposite-color"
import ChessBoard from "@/features/gameplay/components/chess-board"
import { Chess } from "chess.js"
import { playMoveSound } from "@/features/gameplay/utils/play-move-sound"
export default function Page() {
    const params = useParams()
    const gameId = params.id as string
    const dispatch = useAppDispatch()
    const {gameState : {
        activePiece,
        currentTurn,
        playerColor,
        pieces,
        gameOver : {isGameOver},
        players : {
            white,
            black
        },
        isPlayerTurn,
        legalMoves,
        timerOption,
        fen
        // todo : lastMove , isRedoable , preMoves
    } , move} = useMultiplayerGame(gameId)
    // const playerColor = useAppSelector(selectPlayerColor)
    // const fen = useAppSelector(selectFEN)
    // const pieces = useAppSelector(selectPieces)
    // const { level, timer: timerOption } = useAppSelector(selectBotOptions)
    // const lastMove = useAppSelector(selectLastMove)
    // const isGameOver = useAppSelector(selectIsGameOver)
    // const capturedPieces = useAppSelector(selectCapturedPieces)
    // const score = useAppSelector(selectScore)
    // const legalMoves = useAppSelector(selectLegalMoves)
    // const { isRedoable } = useAppSelector(selectIsUndoRedoable)
    // const isPlayerTurn = useAppSelector(selectIsPlayerTurn)
    // const preMoves = useAppSelector(selectPreMoves)
    // const activePiece = useAppSelector(selectActivePiece)
    const enabledMovesAnimation = useAppSelector(selectShouldAnimate("moves"))

    const timer = parseTimer(timerOption)
    const opponentColor = oppositeColor(playerColor)

    const player = playerColor === 'w' ? white : black
    const opponent = playerColor === 'w' ? black : white

    const score = player.points - opponent.points

    return (
        <GameLayout
            chessBoard={
                <ChessBoardLayout
                    OpponentSection={
                        <PlayerSection
                            capturedPieces={opponent.capturedPieces}
                            opponentColor={playerColor}
                            score={(score) < 0 ? -score : 0}
                            username={opponent.name}
                            timer={timer}
                        />
                    }
                    ChessBoard={
                        <ChessBoard
                            animatedMoves={enabledMovesAnimation}
                            // lastMove={lastMove}
                            pieces={pieces}
                            playerColor={playerColor}
                            onMoveStart={(piece) => {
                                // if (isRedoable) {
                                //     // do nothing for now
                                //     // maybe I should reset the latest state ?
                                // } else {
                                //     dispatch(select(piece))
                                // }
                            }}
                            activePiece={activePiece}
                            legalMoves={legalMoves}
                            onMoveEnd={(mv) => {
                                if (!isPlayerTurn) {
                                    // dispatch(premove(mv))
                                } else {
                                    move(mv)
                                    const chess = new Chess(fen)
                                    const theMove = chess.move(mv)
                                    playMoveSound(theMove, chess.inCheck())
                                }
                            }}
                            // preMoves={preMoves}
                            isPlayerTurn={isPlayerTurn}
                        />
                    }
                    PlayerSection={
                        <PlayerSection
                            score={score > 0 ? score : 0}
                            username="Guest"
                            timer={timer}
                            capturedPieces={player.capturedPieces}
                            opponentColor={opponentColor}
                        />
                    }
                />
            }
            gameDetails={<GameDetails />}
            gameOverPopUp={<GameOverPopUp />}
        />
    )
}
