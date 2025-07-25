import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import {
    selectCurrentPlayer,
    selectIsGameOver,
    selectIsNewGame,
} from "@/redux/slices/game/game-selectors"
// import { selectTimerOption } from "@/redux/slices/game/game-selectors"
import { Color } from "chess.js"
import { useEffect, useRef, useState } from "react"
// import parseTimerOption from "../utils/parse-timer-option"
import { timeOut } from "@/redux/slices/game/game-slice"

export default function Timer({
    timeLeft,
    playerColor,
}: {
    timeLeft: number
    playerColor: Color
}) {
    const dispatch = useAppDispatch()
    // const [canStart, setCanStart] = useState(false)

    // useEffect(() => {
    //     // Small delay to ensure Redux state is fully synchronized
    //     const timer = setTimeout(() => setCanStart(true), 500)
    //     return () => clearTimeout(timer)
    // }, [])

    // const timerOption = useAppSelector(selectTimerOption)
    // const { plus } = timerOption ? parseTimerOption(timerOption) : { plus: 0 }
    const isGameOver = useAppSelector(selectIsGameOver)
    const isNewGame = useAppSelector(selectIsNewGame)
    const currentPlayer = useAppSelector(selectCurrentPlayer)
    const [displayTime, setDisplayTime] = useState(timeLeft)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)
    // const startTimeRef = useRef<number | null>(null)
    const lastUpdateRef = useRef<number>(Date.now())

    const isMyTurn = currentPlayer === playerColor && !isGameOver

    ///
    // console.log('timer - playerColor (this client) : ',playerColor)
    // console.log('timer - currentPlayer (currentTurn) : ',currentPlayer)

    // Sync display time with Redux store
    useEffect(() => {
        setDisplayTime(timeLeft)
        lastUpdateRef.current = Date.now()
    }, [timeLeft, isNewGame])

    useEffect(() => {
        console.log("Timer effect triggered:", {
            isMyTurn,
            timeLeft,
            playerColor,
            displayTime,
            isGameOver,
            isNewGame,
        })
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
        }
        if (isMyTurn && timeLeft > 0) {
            lastUpdateRef.current = Date.now()
            // startTimeRef.current = Date.now()
            intervalRef.current = setInterval(() => {
                const now = Date.now()
                const elapsed = now - lastUpdateRef.current
                setDisplayTime((prev) => {
                    const newTime = Math.max(prev - elapsed, 0)

                    // Dispatch timeout if time runs out
                    if (newTime <= 0 && prev > 0) {
                        console.log(`Timeout for ${playerColor}:`, newTime)
                        dispatch(timeOut())
                    }

                    return newTime
                })
                lastUpdateRef.current = now
            }, 100)
        }
        // else if (!isMyTurn && (lastUpdateRef.current > Date.now())) {
        //     setTime((prev) => prev + plus * 1000)
        //     // update timings
        // }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
            intervalRef.current = null
        }
    }, [isMyTurn, playerColor])

    // Clean up on game over
    useEffect(() => {
        if (isGameOver && intervalRef.current) {
            clearInterval(intervalRef.current)
        }
    }, [isGameOver])

    const totalSeconds = Math.floor(displayTime / 1000)

    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    // const hundredMs = Math.floor((time % 1000) / 100)

    return (
        <div className="bg-gray-300 py-0.5 px-3 rounded-md font-bold">
            {minutes}:{seconds.toString().padStart(2, "0")}
            {/* {time <= timeLeft * 100 && <>:{hundredMs}</>} */}
        </div>
    )
}
