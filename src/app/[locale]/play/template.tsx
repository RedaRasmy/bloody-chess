"use client"
import { ReactNode, useEffect } from "react"
import { useAppSelector } from "@/redux/hooks"
import {
    selectGameStartedAt,
    selectIsGameOver,
    // selectWhitePlayer,
    // selectBlackPlayer,
    // selectCurrentPlayer,
    // selectLastMoveAt,
    // selectGameStartedAt,
} from "@/redux/slices/game/game-selectors"
import playSound from "@/features/gameplay/utils/play-sound"
import { selectIsSoundEnabled } from "@/redux/slices/settings/settings-selectors"
// import { calculateTimeLeft } from "@/features/gameplay/utils/calculate-time-left"
// import { updateTimings } from "@/redux/slices/game/game-slice"

export default function Template({ children }: { children: ReactNode }) {
    // const dispatch = useAppDispatch()
    // const isPlayerTurn = useAppSelector(selectIsPlayerTurn)
    // const preMoves = useAppSelector(selectPreMoves)
    const isGameOver = useAppSelector(selectIsGameOver)
    // const whitePlayer = useAppSelector(selectWhitePlayer)
    // const blackPlayer = useAppSelector(selectBlackPlayer)
    // const currentTurn = useAppSelector(selectCurrentPlayer)
    // const lastMoveAt = useAppSelector(selectLastMoveAt)
    const gameStartedAt = useAppSelector(selectGameStartedAt)
    const gameStart = useAppSelector(selectIsSoundEnabled('gameStart'))
    const gameEnd = useAppSelector(selectIsSoundEnabled('gameEnd'))

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
