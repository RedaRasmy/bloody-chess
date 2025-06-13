// import { useDispatch, useSelector, useStore } from "react-redux"
// import { AppDispatch, AppStore, RootState } from "./store"

// export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
// export const useAppSelector = useSelector.withTypes<RootState>()
// export const useAppStore = useStore.withTypes<AppStore>()

import { TypedUseSelectorHook, useDispatch, useSelector, useStore } from 'react-redux'
import type { AppDispatch, RootState, AppStore } from './store'

// Typed versions of the hooks
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppStore = () => useStore<AppStore>()
