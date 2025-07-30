import { Color } from "chess.js"
import { useChessTimer } from "../hooks/use-chess-timer" // Adjust import path as needed

interface TimerProps {
    playerColor: Color
    onTimeOut?: (color: Color) => Promise<void>
}

export default function Timer({ playerColor, onTimeOut }: TimerProps) {
    const { timeLeft, isTimeOut, formatTime } = useChessTimer({
        playerColor,
        onTimeOut,
    })
    
    
    const { formatted } = formatTime(timeLeft)
    
    // Style based on time remaining and timeout state
    const getTimerStyle = () => {
        if (isTimeOut) {
            return "bg-red-500 text-white" // Timeout state
        }
        
        if (timeLeft <= 30000) { // Less than 30 seconds
            return "bg-red-100 text-red-800 animate-pulse"
        }
        
        // if (timeLeft <= 60000) { // Less than 1 minute
        //     return "bg-yellow-100 text-yellow-800"
        // }
        
        return "bg-gray-300 text-gray-800" // Normal state
    }
    
    return (
        <div className={`py-0.5 px-3 rounded-md font-bold transition-colors duration-200 ${getTimerStyle()}`}>
            <div className="flex items-center gap-1">
                <span>{formatted}</span>
            </div>
        </div>
    )
}