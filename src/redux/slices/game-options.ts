import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store"

export type ColorOption = 'white' | 'random' | 'black'

type GameOptions = {
    bot : {
        level : number,
        color : ColorOption
    },
}

const initialState:GameOptions = {
    bot : {
        level : 1,
        color : 'white'
    }
}

const gameOptions = createSlice({
    name: "game-options",
    initialState,
    reducers: {
        changeLevel : (state,action: PayloadAction<number>)=> {
            const lvl = action.payload
            if (lvl < 1 || lvl > 20) return;
            state.bot.level = lvl
        },
        changeColor : (state,action: PayloadAction<ColorOption>)=> {
            const color = action.payload
            state.bot.color = color
        },
    },
})


export const {changeColor,changeLevel} = gameOptions.actions

export default gameOptions.reducer

// Selectors 

export const selectBotOptions = (state:RootState)=>state.options.bot



