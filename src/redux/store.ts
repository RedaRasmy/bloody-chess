import { configureStore } from "@reduxjs/toolkit"
import gameSlice from "./slices/game-slice"

export const makeStore = () => {
    return configureStore({
        reducer: {
            game: gameSlice,
        },
    })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]