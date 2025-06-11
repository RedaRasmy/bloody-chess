import { configureStore } from "@reduxjs/toolkit"
import exampleSlice from "./slices/example-slice"

export const makeStore = () => {
    return configureStore({
        reducer: {
            example: exampleSlice,
        },
    })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]