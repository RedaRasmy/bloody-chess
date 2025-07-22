import { configureStore , combineReducers } from "@reduxjs/toolkit"
import gameSlice from "./slices/game/game-slice"
import gameOptions from "./slices/game-options"
import settings from "./slices/settings"
import multiplayer from "./slices/multiplayer/multiplayer-slice"
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"

const persistConfig = {
    key: "persist",
    storage,
}

const rootReducer = combineReducers({
    game: gameSlice,
    options: gameOptions,
    settings,
    multiplayer
})

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== "production",
            middleware: (getDefaultMiddleware) =>
          getDefaultMiddleware({
            serializableCheck: {
              ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
          }),
  });
};


export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]
