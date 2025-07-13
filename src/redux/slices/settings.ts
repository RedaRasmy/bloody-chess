import { createSlice } from "@reduxjs/toolkit"

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
