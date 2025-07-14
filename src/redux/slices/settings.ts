import { createSlice } from "@reduxjs/toolkit"
import {RootState} from '../store'

const initialState = {
    enableAnimation : true
}

const settings = createSlice({
    name: "settings",
    initialState,
    reducers: {
        
    },
})

export const { } = settings.actions

export default settings.reducer

// Selectors

export const selectEnableAnimation = (state:RootState) => state.settings.enableAnimation