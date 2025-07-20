'use server'

import {db} from '@/db/drizzle'
import {games, moves} from '@/db/schema'
import { MoveType } from '../types'
import { Chess } from 'chess.js'
import { eq } from 'drizzle-orm'


export async function addMove(move:MoveType) {
    // const newMove = await db.insert(moves).values({
    //     moveNumber
    // })
}


export async function makeMove({gameId ,fen, move}:{
    gameId : string,
    fen : string,
    move: MoveType
}) {
  // 1. Get current game state
//   const game = await db.select().from(games).where(eq(games.id, gameId)).limit(1)
//   if (!game[0]) throw new Error('Game not found')
  
  // 2. Validate move server-side
  const chess = new Chess(fen)
  const validatedMove = chess.move(move)
  
  if (!validatedMove) {
    throw new Error('Invalid move')
  }
  
  // 3. Update game state
  await db.update(games).set({
    currentFen: chess.fen(),
    currentTurn: chess.turn(),
    // lastMove: {
    //   from: validatedMove.from,
    //   to: validatedMove.to,
    //   san: validatedMove.san
    // }
  }).where(eq(games.id, gameId))
  
  return { success: true, newFen: chess.fen() }
}