// import type { PayloadAction } from "@reduxjs/toolkit"
// import { Move, Square } from "@/features/gameplay/types"
import { createSlice } from "@reduxjs/toolkit"

export type  GameState = {
    color : 'black' | 'white'
    // board : Square[]

}

const initialState = {
    color : 'white'
}

const gameSlice = createSlice({
    name: "game-state",
    initialState,
    reducers: {
        // move : (state,{payload}:PayloadAction<Move>) => {

        // }
    },
})


export const {} = gameSlice.actions

export default gameSlice.reducer