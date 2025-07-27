// 'use client'

// import { db } from "@/db/drizzle"


// export async function getPlayerByEmail(email:string) {
//     const player = await db.query.players.findFirst({
//         where : (players,{eq}) => eq(players.email,email)
//     })
//     return player
// }