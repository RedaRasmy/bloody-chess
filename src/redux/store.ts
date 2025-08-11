import { configureStore , combineReducers } from "@reduxjs/toolkit"
import * as reducers from './slices'
import packageJson from "@/../package.json"

import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  createMigrate,
} from "redux-persist";
import storage from "redux-persist/lib/storage"


// Parse version to get a numeric version
const getNumericVersion = (version: string) => {
  const [major, minor] = version.split('.').map(Number);
  return major * 1000 + minor; // 1.2.0 → 1002
}

const migrations = {
  // Define what happens when migrating between versions
  1: () => {
    return undefined; // Start fresh
  },
  2: () => {
    // Migration for version 0.2.x
    return undefined; // Clear everything
  },
  3: () => {
    return undefined; // Clear everything
  },
}

const persistConfig = {
    key: "persist",
    storage,
    version : getNumericVersion(packageJson.version),
    migrate : createMigrate(migrations,{debug:true})
}

const rootReducer = combineReducers(reducers)

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
