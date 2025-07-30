import { useEffect, useRef, useState } from "react"

export default function useChessCountdown({
    timeLeft,
    plusMs = 0,
    onTimeOut,
}: {
    timeLeft: number
    plusMs?: number
    onTimeOut: () => void
}) {
    const [count, setCount] = useState(timeLeft)
    const [isRunning, setIsRunning] = useState(false)
    const countRef = useRef(timeLeft)

    useEffect(() => {
        countRef.current = timeLeft // Sync with prop changes
        setCount(timeLeft)
    }, [timeLeft])

    function pause() {
        setIsRunning(false)
        setCount((prev) => prev + plusMs)
    }

    function resume() {
        setIsRunning(true)
    }

    useEffect(() => {
        if (!isRunning) return

        const interval = setInterval(() => {
            countRef.current = Math.max(countRef.current - 100, 0)
            setCount(countRef.current)
            if (countRef.current <= 0) {
                setIsRunning(false)
                onTimeOut()
            }
        }, 100)

        return () => {
            clearInterval(interval)
        }
    }, [isRunning])

    return {
        pause,
        resume,
        count,
        isRunning,
    }
}
