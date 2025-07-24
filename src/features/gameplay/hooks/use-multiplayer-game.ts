import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { supabase } from "@/utils/supabase/client"
import { useEffect, useState } from "react"
import { MoveType } from "../types"
import { setup, sync } from "@/redux/slices/multiplayer/multiplayer-slice"
import { move as localMove } from "@/redux/slices/game/game-slice"
import { Game } from "@/db/types"
import { makeMove } from "../server-actions/moves-actions"
import { getFullGame } from "../server-actions/games-actions"
import usePlayer from "./use-player"
import { selectPlayerColor } from "@/redux/slices/game/game-selectors"

export const useMultiplayerGame = (gameId: string) => {
    const dispatch = useAppDispatch()
    const multiplayerState = useAppSelector((state) => state.multiplayer)
    const playerColor = useAppSelector(selectPlayerColor)
    const player = usePlayer()
    const [isLoading,setIsLoading] = useState(true)

    useEffect(() => { 
        if (player.type !== 'loading') {
            const {data} = player
            async function setState(){
                console.log('setuping the game ...')
                const game = await getFullGame(gameId)
                dispatch(setup({
                    game ,
                    playerId : data.id
                }))
                setIsLoading(false)
            }
            setState()
        }
     },[player.type])

    useEffect(() => {
        // Subscribe to game updates
        const channel = supabase
            .channel(`game:${gameId}`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "games",
                    filter: `id=eq.${gameId}`,
                },
                (payload) => {
                    dispatch(sync(payload.new as Game))
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "moves",
                    filter: `game_id=eq.${gameId}`,
                },
                (payload) => {
                    
                    //   dispatch(addMove(payload.new))
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [gameId])

    const move = async (mv: MoveType) => {
        // Optimistic update
        // dispatch(localMove(mv))

        try {
            // Insert to Supabase

            const response = await makeMove({
                move : mv,
                gameId,
            })

        } catch (err) {
            //   dispatch(rollbackMove())
        }
    }

    return { multiplayerState, move , playerColor  , isSetuping : isLoading }
}
