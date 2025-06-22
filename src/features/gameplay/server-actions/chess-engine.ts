'use server'

import { EngineResponse } from "../types"


export async function getEngineResponse(fen:string,level:number):Promise<EngineResponse> {

    const res = await fetch(`https://stockfish.online/api/s/v2.php?fen=${encodeURIComponent(fen)}&depth=${level}`)
    if (!res.ok) {
        throw new Error("Network response was not ok")
    }
    return await res.json()
}

