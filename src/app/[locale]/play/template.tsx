"use client"
import { ReactNode, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { selectIsPlayerTurn, selectPreMoves,selectIsGameOver } from "@/redux/slices/game-slice"
import { removePremove, move } from "@/redux/slices/game-slice"
import playSound from "@/features/gameplay/utils/play-sound"

export default function Template({ children }: { children: ReactNode }) {
    const dispatch = useAppDispatch()
    const isPlayerTurn = useAppSelector(selectIsPlayerTurn)
    const preMoves = useAppSelector(selectPreMoves)
    const isGameOver = useAppSelector(selectIsGameOver)

    useEffect(() => {
        if (!isGameOver) {
            playSound("game-start")
        } else {
            playSound("game-end")
        }
    }, [isGameOver])

    // Premoves Processor
    useEffect(() => {
        if (preMoves.length > 0 && isPlayerTurn) {
            const nextMove = preMoves[0]
            dispatch(move(nextMove))
            dispatch(removePremove()) // delete the move from the queue
        }
    }, [preMoves, isPlayerTurn, dispatch])

    return <>{children}</>
}
