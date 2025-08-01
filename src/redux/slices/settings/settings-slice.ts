import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Settings } from "./settings-types"

const initialState = {
    animation: {
        enabled: true as boolean,
        moves: {
            enabled: true as boolean,
            durationMs: 200,
        },
    },
    sound: {
        enabled: true as boolean,
        moves: {
            enabled: true as boolean,
        },
    },
} satisfies Settings

const settings = createSlice({
    name: "settings",
    initialState,
    reducers: {
        updateMovesAnimation: (
            state,
            action: PayloadAction<
                Partial<{ enabled: boolean; durationMs: number }>
            >
        ) => {
            const {enabled,durationMs} = action.payload
            if (enabled !== undefined) {
                state.animation.moves.enabled = enabled
            }
            if (durationMs !== undefined) {
                state.animation.moves.durationMs = durationMs
            }
        },
        updateMovesSound: (
            state,
            action: PayloadAction<
                Partial<{ enabled: boolean}>
            >
        ) => {
            const {enabled} = action.payload
            if (enabled !== undefined) {
                state.sound.moves.enabled = enabled
            }
        },
        reset : () => initialState
    },
})

export const {updateMovesAnimation,updateMovesSound , reset}  = settings.actions

export default settings.reducer
