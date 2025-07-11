"use client"
import { ReactNode, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { selectIsPlayerTurn, selectPreMoves } from "@/redux/slices/game-slice"
import { removePremove,move } from "@/redux/slices/game-slice"

export default function template({ children }: { children: ReactNode }) {
    const dispatch = useAppDispatch()
    const isPlayerTurn = useAppSelector(selectIsPlayerTurn)
    const preMoves = useAppSelector(selectPreMoves)

    
    useEffect(() => {
        if (preMoves.length > 0 && isPlayerTurn) {
            const nextMove = preMoves[0]
            dispatch(move(nextMove))
            dispatch(removePremove()) // Remove from queue
        }
    }, [preMoves, isPlayerTurn, dispatch])


    return <>{children}</>
}
