import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import {
    selectCurrentPlayer,
    selectIsGameOver,
    timeOut,
    selectIsNewGame
} from "@/redux/slices/game-slice"
import { Color } from "chess.js"
import { useEffect, useRef, useState } from "react"

export default function Timer({
    duration,
    plus,
    player,
}: {
    duration: number
    player: Color
    plus: number
}) {
    const isGameOver = useAppSelector(selectIsGameOver)
    const isNewGame = useAppSelector(selectIsNewGame)
    const currentPlayer = useAppSelector(selectCurrentPlayer)
    const [time,setTime]= useState(duration)
    const intervalRef = useRef<NodeJS.Timeout|null>(null)

    const isRunning = currentPlayer === player && !isGameOver

    const [didPlay,setDidPlay] = useState(false)

    useEffect(() => { 
        if (!isGameOver) {
            setTime(duration)
        }
     },[isGameOver,duration,isNewGame])
    
    useEffect(() => {
        if (isRunning) {
            setDidPlay(true)
            intervalRef.current = setInterval(() => {
                setTime(prev => Math.max(prev-1,0))
            },1000)
        } else if (!isRunning && didPlay) {
            setTime(prev=>prev+plus)
        }
        
        return () => { 
            if (intervalRef.current) clearInterval(intervalRef.current)
         }
     },[isRunning,plus,didPlay])

    const dispatch = useAppDispatch()


    const minutes = Math.floor(time / 60)
    const seconds = time % 60

    useEffect(() => {
        if (time===0) {
            dispatch(timeOut())
        }
    },[time,dispatch])


    return (
        <div className="bg-gray-300 py-0.5 px-3 rounded-md font-bold">
            {minutes}:{seconds.toString().padStart(2, "0")}
        </div>
    )
}
