import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store"
import { ChessTimerOption } from "@/features/gameplay/types"

export type ColorOption = 'white' | 'random' | 'black'

type GameOptions = {
    bot : {
        level : number,
        color : ColorOption
        timer : ChessTimerOption | null
    },
}

const initialState:GameOptions = {
    bot : {
        level : 1,
        color : 'white',
        timer : null
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
        changeTimer : (state,action:PayloadAction<ChessTimerOption | null>)=>{
            const timerOption = action.payload
            state.bot.timer = timerOption
        }
    },
})


export const {changeColor,changeLevel,changeTimer} = gameOptions.actions

export default gameOptions.reducer

// Selectors 

export const selectBotOptions = (state:RootState)=>state.options.bot



