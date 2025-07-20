// import ChessBoardLayout from "@/features/gameplay/components/chess-board-layout"
// import GameDetails from "@/features/gameplay/components/game-details"
// import GameLayout from "@/features/gameplay/components/game-layout"
// import GameOverPopUp from "@/features/gameplay/components/game-over-pop-up"
// import PlayerSection from "@/features/gameplay/components/player-section"
// import { useAppDispatch, useAppSelector } from "@/redux/hooks"
// import { useParams } from "next/navigation"
// export default function Page() {
//     const params = useParams()
//     const gameId = params.id as string
//     const dispatch = useAppDispatch()
//     // const playerColor = useAppSelector(selectPlayerColor)
//     // const fen = useAppSelector(selectFEN)
//     // const pieces = useAppSelector(selectPieces)
//     // const { level, timer: timerOption } = useAppSelector(selectBotOptions)
//     // const lastMove = useAppSelector(selectLastMove)
//     // const isGameOver = useAppSelector(selectIsGameOver)
//     // const capturedPieces = useAppSelector(selectCapturedPieces)
//     // const score = useAppSelector(selectScore)
//     // const legalMoves = useAppSelector(selectLegalMoves)
//     // const { isRedoable } = useAppSelector(selectIsUndoRedoable)
//     // const isPlayerTurn = useAppSelector(selectIsPlayerTurn)
//     // const preMoves = useAppSelector(selectPreMoves)
//     // const activePiece = useAppSelector(selectActivePiece)
//     const enabledMovesAnimation = useAppSelector(selectShouldAnimate("moves"))

//     const timer = timerOption ? parseTimer(timerOption) : undefined
//     const opponentColor = oppositeColor(playerColor)

//     return (
//         <GameLayout
//             chessBoard={
//                 <ChessBoardLayout
//                     OpponentSection={
//                         <PlayerSection
//                             capturedPieces={capturedPieces[playerColor]}
//                             opponentColor={playerColor}
//                             score={score < 0 ? -score : 0}
//                             username={`bot-${level}`}
//                             timer={timer}
//                         />
//                     }
//                     ChessBoard={
//                         <ChessBoard
//                             animatedMoves={enabledMovesAnimation}
//                             lastMove={lastMove}
//                             pieces={pieces}
//                             playerColor={playerColor}
//                             onMoveStart={(piece) => {
//                                 if (isRedoable) {
//                                     // do nothing for now
//                                     // maybe I should reset the latest state ?
//                                 } else {
//                                     dispatch(select(piece))
//                                 }
//                             }}
//                             activePiece={activePiece}
//                             legalMoves={legalMoves}
//                             onMoveEnd={(mv) => {
//                                 if (!isPlayerTurn) {
//                                     dispatch(premove(mv))
//                                 } else {
//                                     dispatch(move(mv))
//                                     const chess = new Chess(fen)
//                                     const theMove = chess.move(mv)
//                                     playMoveSound(theMove, chess.inCheck())
//                                 }
//                             }}
//                             preMoves={preMoves}
//                             isPlayerTurn={isPlayerTurn}
//                         />
//                     }
//                     PlayerSection={
//                         <PlayerSection
//                             score={score > 0 ? score : 0}
//                             username="Guest"
//                             timer={timer}
//                             capturedPieces={capturedPieces[opponentColor]}
//                             opponentColor={opponentColor}
//                         />
//                     }
//                 />
//             }
//             gameDetails={<GameDetails />}
//             gameOverPopUp={<GameOverPopUp />}
//         />
//     )
// }
