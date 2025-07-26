"use server"

import { EngineResponse } from "../gameplay/types"

export async function getEngineResponse(
    fen: string,
    level: number
): Promise<EngineResponse> {
    try {
        const res = await fetch(
            `https://stockfish.online/api/s/v2.php?fen=${encodeURIComponent(
                fen
            )}&depth=${level}`
        )
        if (!res.ok) {
            throw new Error("Network response was not ok")
        }
        return await res.json()
    } catch (error) {
        console.log(error)
        return getEngineResponse(fen, level)
    }
}

// I should set a max retries -> throw user friendly error with UI
// TODO: search about what best to do for better UX if the bot failed to responde
// or maybe I should set a client engine version fallback (wasm?) if the API failed
