import { configureStore } from "@reduxjs/toolkit"
import gameSlice from "./slices/game-slice"
import gameOptions from "./slices/game-options"
import settings from "./slices/settings"

export const makeStore = () => {
    return configureStore({
        reducer: {
            game: gameSlice,
            options : gameOptions,
            settings
        },
    })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]