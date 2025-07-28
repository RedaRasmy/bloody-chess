import { FinishedGame, FullGame, StartedGame } from "@/db/types"
import { MoveType } from "@/features/gameplay/types"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type ConnectionStatus = "connected" | "disconnected" | "reconnecting"

const initialState = {
    gameId: "",
    whiteId: "",
    blackId: "",
    connectionStatus: "connected" as ConnectionStatus,

    pendingMoves: [] as MoveType[],
}

const multiplayerSlice = createSlice({
    name: "multiplayer",
    initialState,
    reducers: {
        setup: (
            state,
            action: PayloadAction<{ game: FullGame; playerId: string }>
        ) => {
            const { game } = action.payload

            state.gameId = game.id
            state.whiteId = game.whiteId
            state.blackId = game.blackId
        },
        sync: (state, action: PayloadAction<StartedGame | FinishedGame>) => {
            state.gameId = action.payload.id
        },
    },
})

export const { sync, setup } = multiplayerSlice.actions
export default multiplayerSlice.reducer
