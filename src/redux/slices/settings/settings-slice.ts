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
    audio: {
        enabled: true as boolean,
        moves: true as boolean,
        gameStart : true as boolean,
        gameEnd: true as boolean,
        timeout : true as boolean
    },
} satisfies Settings


type Sound = keyof typeof initialState['audio'] 

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
        ToggleSound: (
            state,
            action: PayloadAction<Sound>
        ) => {
            const sound = action.payload

            state.audio[sound] = !state.audio[sound]
        },
        reset : () => initialState
    },
})

export const {updateMovesAnimation,ToggleSound , reset}  = settings.actions

export default settings.reducer
