import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import {
    selectCurrentPlayer,
    selectIsGameOver,
    selectIsNewGame,
} from "@/redux/slices/game/game-selectors"
import { selectTimerOption } from "@/redux/slices/game/game-selectors"
import { Color } from "chess.js"
import { useEffect, useRef, useState } from "react"
import parseTimerOption from "../utils/parse-timer-option"
import { timeOut } from "@/redux/slices/game/game-slice"

export default function Timer({
    timeLeft,
    playerColor,
}: {
    timeLeft: number
    playerColor: Color
}) {
    const timerOption = useAppSelector(selectTimerOption)
    const { plus } = timerOption ? parseTimerOption(timerOption) : { plus: 0 }
    const isGameOver = useAppSelector(selectIsGameOver)
    const isNewGame = useAppSelector(selectIsNewGame)
    const currentPlayer = useAppSelector(selectCurrentPlayer)
    const [time, setTime] = useState(timeLeft)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)
    const startTimeRef = useRef<number | null>(null)

    const isRunning = currentPlayer === playerColor && !isGameOver

    const [didPlay, setDidPlay] = useState(false)

    useEffect(() => {
        if (!isGameOver) {
            setTime(timeLeft)
        }
    }, [isGameOver, timeLeft, isNewGame])

    useEffect(() => {
        if (isRunning) {
            setDidPlay(true)
            startTimeRef.current = Date.now()
            intervalRef.current = setInterval(() => {
                const now = Date.now()
                const elapsed = now - (startTimeRef.current || now)
                setTime((prev) => Math.max(prev - elapsed, 0))
                startTimeRef.current = now
            }, 100)
        } else if (!isRunning && didPlay) {
            setTime((prev) => prev + plus * 1000)
            // update timings
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
            startTimeRef.current = null
        }
    }, [isRunning, plus, didPlay])

    const dispatch = useAppDispatch()

    const totalSeconds = Math.floor(time / 1000)

    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    // const hundredMs = Math.floor((time % 1000) / 100)

    useEffect(() => {
        if (time <= 0) {
            console.log('timeout , time =',time)
            dispatch(timeOut())
        }
    }, [time, dispatch])

    return (
        <div className="bg-gray-300 py-0.5 px-3 rounded-md font-bold">
            {minutes}:{seconds.toString().padStart(2, "0")}
            {/* {time <= timeLeft * 100 && <>:{hundredMs}</>} */}
        </div>
    )
}
