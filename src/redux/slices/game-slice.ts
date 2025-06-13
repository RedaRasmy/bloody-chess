// import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"
import {Chess} from 'chess.js'
import { RootState } from "../store"


const initialState = new Chess()


const gameSlice = createSlice({
    name: "game-state",
    initialState,
    reducers: {
        // move : (state,{payload}) => {

        // }
    },
})


export const {} = gameSlice.actions

export default gameSlice.reducer


// Selectors 

export const selectBoard = (state:RootState) => state.game.board() 

