import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { supabase } from "@/utils/supabase/client"
import { useEffect } from "react"
import { MoveType } from "../types"
import { setup, sync } from "@/redux/slices/multiplayer/multiplayer-slice"
import { Game } from "@/db/types"
import { makeMove } from "../server-actions/moves-actions"
import { getFullGame } from "../server-actions/games-actions"
import usePlayer from "./use-player"

export const useMultiplayerGame = (gameId: string) => {
    const dispatch = useAppDispatch()
    const gameState = useAppSelector((state) => state.game)
    const player = usePlayer()

    useEffect(() => { 
        if (gameState.gameId === '' && player.type !== 'loading') {
            const {data} = player
            async function setState(){
                console.log('No gameId in state , setuping full game ...')
                const game = await getFullGame(gameId)
                dispatch(setup({
                    game ,
                    playerId : data.id
                }))
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

    const move = async (move: MoveType) => {
        // Optimistic update
        // dispatch(localMove(move))

        try {
            // Insert to Supabase

            const response = await makeMove({
                move,
                gameId,
            })

        } catch (err) {
            //   dispatch(rollbackMove())
        }
    }

    return { gameState, move }
}
