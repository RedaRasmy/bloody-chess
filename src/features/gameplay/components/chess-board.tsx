import { DndContext } from "@dnd-kit/core"
import Droppable from "./droppable"
import SelectPromotion from "./select-promotion"
import { restrictToWindowEdges, snapCenterToCursor } from "@dnd-kit/modifiers"
import { cn } from "@/lib/utils"
import dynamic from "next/dynamic"
import { useAppSelector } from "@/redux/hooks"
const ChessPiece = dynamic(() => import("./chess-piece"))
import { selectAnimationSetting } from "@/redux/slices/settings/settings-selectors"
import useChessBoard from "../hooks/use-chess-board"
import ChessSquare from "./chess-square"
import { MoveType } from "../types"
import getPieces from "../utils/get-pieces"
import GameDelayOverlay from "./game-delay-overlay"
import { selectGameStartedAt } from "@/redux/slices/game/game-selectors"

export default function ChessBoard({
    onMoveEnd,
    fen,
    move,
}: {
    onMoveEnd?: (move: MoveType) => Promise<void>
    fen?: string
    move?: MoveType
}) {
    const { enabled: animatedMoves, durationMs } = useAppSelector(
        selectAnimationSetting("moves")
    )
    const gameStartedAt = useAppSelector(selectGameStartedAt)

    const {
        boardWidth,
        clickSquare,
        drag,
        drop,
        isPromoting,
        promote,
        squares,
        playerColor,
        cancelPromotion,
        lastMove,
        allowedSquares,
        pieces,
    } = useChessBoard({ onMoveEnd })

    const piecesToShow = fen ? getPieces(fen) : pieces
    const lastMoveToShow = move ?? lastMove

    const isIdle = fen !== undefined

    return (
        <DndContext
            modifiers={[restrictToWindowEdges, snapCenterToCursor]}
            onDragStart={drag}
            onDragEnd={drop}
        >
            <div
                id="chess-board"
                className={cn(
                    "relative grid grid-cols-8 grid-rows-8 aspect-square"
                )}
            >
                <SelectPromotion
                    onChange={promote}
                    color={playerColor}
                    open={isPromoting}
                    onClickOutside={cancelPromotion}
                />
                <GameDelayOverlay gameStartedAt={gameStartedAt} />
                {squares.map((sq) => (
                    <Droppable key={sq} id={sq}>
                        <ChessSquare
                            squareName={sq}
                            isLastMove={
                                !!lastMoveToShow &&
                                (lastMoveToShow.from === sq ||
                                    lastMoveToShow.to === sq)
                            }
                            // isPreMove={
                            //     !!preMoves.find(
                            //         (mv) => mv.from === sq || mv.to === sq
                            //     )
                            // }
                            isTarget={
                                isIdle ? false : allowedSquares.includes(sq)
                            }
                            onClick={isIdle ? () => {} : clickSquare}
                        />
                    </Droppable>
                ))}
                {piecesToShow.map((piece) => {
                    if (piecesToShow && boardWidth) {
                        return (
                            <ChessPiece
                                idle={isIdle || allowedSquares.includes(piece.square)}
                                animated={animatedMoves}
                                durationMs={durationMs}
                                reversed={playerColor === "b"}
                                boardWidth={boardWidth}
                                key={piece.id}
                                data={piece}
                            />
                        )
                    }
                })}
            </div>
        </DndContext>
    )
}
