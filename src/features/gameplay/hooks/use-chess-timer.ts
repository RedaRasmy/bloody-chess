import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import {
    selectCurrentPlayer,
    selectGameStartedAt,
    selectIsGameOver,
    selectLastMoveAt,
    selectTimerOption,
    selectWhitePlayer,
    selectBlackPlayer,
} from "@/redux/slices/game/game-selectors"
import { timeOut } from "@/redux/slices/game/game-slice"
import { Color } from "chess.js"
import { useCallback, useEffect, } from "react"
import parseTimerOption from "@/features/gameplay/utils/parse-timer-option"
import useChessCountdown from "./use-chess-countdown"

interface UseTimerProps {
    playerColor: Color
    onTimeOut?: (color: Color) => Promise<void>
}


export const useChessTimer = ({ playerColor, onTimeOut }: UseTimerProps) => {
    const dispatch = useAppDispatch()

    // Selectors
    const isGameOver = useAppSelector(selectIsGameOver)
    const currentPlayer = useAppSelector(selectCurrentPlayer)
    const gameStartedAt = useAppSelector(selectGameStartedAt)
    const lastMoveAt = useAppSelector(selectLastMoveAt)
    const player = useAppSelector(
        playerColor === "w" ? selectWhitePlayer : selectBlackPlayer
    )
    const timerOption = useAppSelector(selectTimerOption)

    // Checks
    if (!timerOption)
        throw new Error(
            "timerOption should be defined while using useChessTimer"
        )
    if (player.timeLeft === null)
        throw new Error(
            "player.timeLeft should be defined while using useChessTimer"
        )
    //
    // Computed values
    const isMyTurn = currentPlayer === playerColor && !isGameOver
    const canRun = gameStartedAt !== null && !isGameOver

    const { plus } = parseTimerOption(timerOption)

    const timeElapsed = gameStartedAt
        ? Date.now() - (lastMoveAt ? lastMoveAt : gameStartedAt)
        : 0

    /// correct only the current player timer
    const timeLeft = player.timeLeft - (isMyTurn ? timeElapsed : 0)

    const { count, pause, resume } = useChessCountdown({
        timeLeft,
        plusMs: plus * 1000,
        onTimeOut: async () => {
            console.log(`⏰ Timeout for ${playerColor}`)
            if (onTimeOut) {
                // Multiplayer - let server handle it
                await onTimeOut(playerColor)
            } else {
                // Bot game - handle locally
                dispatch(timeOut())
            }
        },
    })

    useEffect(() => {
        if (isMyTurn && canRun) {
            resume()
        } else if (count!==timeLeft) { // to prevent add bonus on start
            pause()
        }
    }, [isMyTurn, canRun])

    // Format time for display
    const formatTime = useCallback((timeMs: number) => {
        const totalSeconds = Math.floor(timeMs / 1000)
        const minutes = Math.floor(totalSeconds / 60)
        const seconds = totalSeconds % 60

        return {
            minutes,
            seconds,
            formatted: `${minutes}:${seconds.toString().padStart(2, "0")}`,
        }
    }, [])

    return {
        timeLeft: count,
        isTimeOut: count === 0,
        formatTime,
    }
}
