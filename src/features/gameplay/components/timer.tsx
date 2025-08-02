import { Color } from "chess.js"
import { useChessTimer } from "../hooks/use-chess-timer" // Adjust import path as needed
import parseTimerOption from "../utils/parse-timer-option"
import playSound from "../utils/play-sound"
import { useEffect, useState } from "react"
import { selectIsSoundEnabled } from "@/redux/slices/settings/settings-selectors"
import { useAppSelector } from "@/redux/hooks"
import { selectPlayerColor } from "@/redux/slices/game/game-selectors"

interface TimerProps {
    playerColor: Color
    onTimeOut?: (color: Color) => Promise<void>
}

export default function Timer({ playerColor, onTimeOut }: TimerProps) {
    const { timeLeft, isTimeOut, formatTime, timerOption } = useChessTimer({
        playerColor,
        onTimeOut,
    })
    const clientColor = useAppSelector(selectPlayerColor)
    const isAlertEnabled = useAppSelector(selectIsSoundEnabled("timeout"))

    const isClient = clientColor === playerColor

    const { base } = parseTimerOption(timerOption)
    const { formatted } = formatTime(timeLeft)
    const [soundRan, setSoundRan] = useState(false)

    // TODO: change urgency to be controlled in settings

    function getUrgentThreshold() {
        if (base <= 60) return 10
        if (base <= 300) return 30
        if (base <= 600) return 45
        return 60
    }

    function isUrgent() {
        return timeLeft / 1000 <= getUrgentThreshold()
    }

    useEffect(() => {
        if (soundRan) return
        if (isUrgent()) {
            if (isClient && isAlertEnabled) playSound("timeout-alert")
            setSoundRan(true)
        }
    }, [timeLeft, soundRan])

    // Style based on time remaining and timeout state
    const getTimerStyle = () => {
        if (isTimeOut) {
            return "bg-red-500 text-white" // Timeout state
        }

        if (isUrgent()) {
            return "bg-red-100 text-red-800 animate-pulse"
        }

        return "bg-gray-300 text-gray-800" // Normal state
    }

    return (
        <div
            className={`py-0.5 px-3 rounded-md font-bold transition-colors duration-200 ${getTimerStyle()}`}
        >
            <div className="flex items-center gap-1">
                <span>{formatted}</span>
            </div>
        </div>
    )
}
