import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { supabase } from "@/utils/supabase/client"
import { useEffect } from "react"
import { MoveType } from "../types"

export const useMultiplayerGame = (gameId: string) => {
  const dispatch = useAppDispatch()
  const gameState = useAppSelector((state) => state.multiplayer)

  useEffect(() => {
    // Subscribe to game updates
    const channel = supabase
      .channel(`game:${gameId}`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'games', filter: `id=eq.${gameId}` },
        (payload) => {
        //   dispatch(syncGameState(payload.new))
        }
      )
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'moves', filter: `game_id=eq.${gameId}` },
        (payload) => {
        //   dispatch(addMove(payload.new))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [gameId])

  const makeMove = async (move: MoveType) => {
    // Optimistic update
    // dispatch(localMove(move))
    
    try {
      // Insert to Supabase
    //   const { error } = await supabase
    //     .from('moves')
    //     .insert({
    //       game_id: gameId,
    //       from_square: move.from,
    //       to_square: move.to,
    //       player_id: gameState.currentPlayerId,
    //       fen_after: newFen
    //     })
      
    //   if (error) {
    //     Rollback optimistic update
    //     dispatch(rollbackMove())
    //   }
    } catch (err) {
    //   dispatch(rollbackMove())
    }
  }

  return { gameState, makeMove }
}