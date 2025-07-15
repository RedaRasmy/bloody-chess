import { createSlice, createSelector } from "@reduxjs/toolkit"
import { RootState } from "../store"
import { Primitive } from "@/utils/global-types"

type SettingValue = {
    enabled: boolean
    [key: string]: Primitive | any[] | SettingValue
}
type Settings = Record<string, SettingValue>

const initialState = {
  animation: {
    enabled: false as boolean,
    moves: true as boolean,
  },
} satisfies Settings

const settings = createSlice({
    name: "settings",
    initialState,
    reducers: {
        // toggleMoves: (state) => {
        //     state.animation.enabled = false
        // },
    },
})

export const {} = settings.actions

export default settings.reducer

// Helpper Types

type Setting = keyof RootState["settings"]

type Type<S extends Setting> = Exclude<
    keyof RootState["settings"][S],
    "enabled"
>

// Selectors

export const selectAnimationSettings = (state: RootState) =>
    state.settings.animation

export const selectEnableAnimations = (state: RootState) =>
    state.settings.animation.enabled

export const selectShouldAnimate = (animationType: Type<"animation">) =>
    createSelector(
        [selectEnableAnimations, selectAnimationSettings],
        (globalEnabled, animation) =>
            globalEnabled && animation[animationType] === true
    )
