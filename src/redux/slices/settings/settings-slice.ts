import { createSlice } from "@reduxjs/toolkit"
import { Settings } from "./settings-types"

const initialState = {
    animation: {
        enabled: true ,
        moves: {
            enabled: true ,
            durationMs: 200,
        },
    },
} satisfies Settings

const settings = createSlice({
    name: "settings",
    initialState,
    reducers: {
        // toggleMoves: (state) => {
        //     state.animation.enabled = false
        // },
    },
})

export const {} = settings.actions

export default settings.reducer

