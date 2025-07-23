"use client"
import { ReactNode, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { selectIsGameOver, selectWhitePlayer , selectBlackPlayer, selectCurrentPlayer, selectLastMoveAt, selectGameStartedAt} from "@/redux/slices/game/game-selectors"
import playSound from "@/features/gameplay/utils/play-sound"
import { calculateTimeLeft } from "@/features/gameplay/utils/calculate-time-left"
import { updateTimings } from "@/redux/slices/game/game-slice"

export default function Template({ children }: { children: ReactNode }) {
    const dispatch = useAppDispatch()
    // const isPlayerTurn = useAppSelector(selectIsPlayerTurn)
    // const preMoves = useAppSelector(selectPreMoves)
    const isGameOver = useAppSelector(selectIsGameOver)
    const whitePlayer = useAppSelector(selectWhitePlayer)
    const blackPlayer = useAppSelector(selectBlackPlayer)
    const currentTurn = useAppSelector(selectCurrentPlayer)
    const lastMoveAt = useAppSelector(selectLastMoveAt)
    const gameStartedAt = useAppSelector(selectGameStartedAt)

    useEffect(() => {
        if (!isGameOver) {
            playSound("game-start")
        } else {
            playSound("game-end")
        }
    }, [isGameOver])

    // Timer Correction


    useEffect(() => {
        const wtl = whitePlayer.timeLeft
        const btl = blackPlayer.timeLeft
        if (wtl !== null && btl !== null && gameStartedAt !== null) {
            const { whiteTimeLeft, blackTimeLeft } = calculateTimeLeft({
                whiteTimeLeft : wtl,
                blackTimeLeft : btl,
                currentTurn,
                lastMoveAt: lastMoveAt ? new Date(lastMoveAt) : new Date(gameStartedAt),
            })
            dispatch(updateTimings({
                whiteTimeLeft ,
                blackTimeLeft 
            }))
        }
    }, [])

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
