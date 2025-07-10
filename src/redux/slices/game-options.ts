import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store"
import { ChessTimerOption, ColorOption } from "@/features/gameplay/types"

const initialState = {
    bot: {
        level: 1,
        color: "white" as ColorOption,
        timer: null as null | ChessTimerOption,
    },
    multiplayer: {
        timer: "blitz 3+0" as ChessTimerOption,
    },
}

const gameOptions = createSlice({
    name: "game-options",
    initialState,
    reducers: {
        changeLevel: (state, action: PayloadAction<number>) => {
            const lvl = action.payload
            if (lvl < 1 || lvl > 20) return
            state.bot.level = lvl
        },
        changeColor: (state, action: PayloadAction<ColorOption>) => {
            const color = action.payload
            state.bot.color = color
        },
        changeTimer: (
            state,
            action: PayloadAction<ChessTimerOption | null>
        ) => {
            const timerOption = action.payload
            state.bot.timer = timerOption
            if (timerOption) state.multiplayer.timer = timerOption
        },
    },
})

export const { changeColor, changeLevel, changeTimer } = gameOptions.actions

export default gameOptions.reducer

// Selectors

export const selectBotOptions = (state: RootState) => state.options.bot
export const selectMultiplayerOptions = (state: RootState) => state.options.multiplayer
