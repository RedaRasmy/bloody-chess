'use server'

import {db} from '@/db/drizzle'
import {moves} from '@/db/schema'
import { MoveType } from '../types'


export async function addMove(move:MoveType) {
    // const newMove = await db.insert(moves).values({
    //     moveNumber
    // })
}