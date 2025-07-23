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

export default function ChessBoard({
    onMoveEnd,
}: {
    onMoveEnd?: (move: MoveType) => Promise<void>
}) {
    const { enabled: animatedMoves, durationMs } = useAppSelector(
        selectAnimationSetting("moves")
    )

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
                {squares.map((sq) => (
                    <Droppable key={sq} id={sq}>
                        <ChessSquare
                            squareName={sq}
                            isLastMove={
                                !!lastMove &&
                                (lastMove.from === sq || lastMove.to === sq)
                            }
                            // isPreMove={
                            //     !!preMoves.find(
                            //         (mv) => mv.from === sq || mv.to === sq
                            //     )
                            // }
                            isTarget={allowedSquares.includes(sq)}
                            onClick={clickSquare}
                        />
                    </Droppable>
                ))}
                {pieces.map((piece) => {
                    if (piece && boardWidth) {
                        return (
                            <ChessPiece
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
