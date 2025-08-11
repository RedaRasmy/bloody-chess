"use client"
import { ReactNode, useEffect } from "react"
import { useAppSelector } from "@/redux/hooks"
import {
    selectGameStartedAt,
    selectIsGameOver,
} from "@/redux/slices/game/game-selectors"
import playSound from "@/features/gameplay/utils/play-sound"
import { selectIsAudioEnabled } from "@/redux/slices/settings/settings-selectors"

export default function Template({ children }: { children: ReactNode }) {
    const isGameOver = useAppSelector(selectIsGameOver)
    const gameStartedAt = useAppSelector(selectGameStartedAt)
    const gameStart = useAppSelector(selectIsAudioEnabled('gameStart'))
    const gameEnd = useAppSelector(selectIsAudioEnabled('gameEnd'))

    useEffect(() => {
        if (gameStart && gameStartedAt && gameStartedAt <= Date.now() ) {
            playSound("game-start")
        } else if (gameEnd && isGameOver) {
            playSound("game-end")
        }
    }, [isGameOver,gameStartedAt,gameStart,gameEnd])


    // Premoves Processor
    // useEffect(() => {
    //     if (preMoves.length > 0 && isPlayerTurn) {
    //         const nextMove = preMoves[0]
    //         dispatch(move(nextMove))
    //         dispatch(removePremove()) // delete the move from the queue
    //     }
    // }, [preMoves, isPlayerTurn, dispatch])

    return <>{children}</>
}
