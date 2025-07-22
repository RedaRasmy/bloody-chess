import { createSlice, createSelector } from "@reduxjs/toolkit"
import { RootState } from "../store"
import { Primitive, List } from "@/utils/global-types"

type SettingValue = {
    enabled: boolean
    [key: string]: Primitive | List | SettingValue
}
type Settings = Record<string, SettingValue>

const initialState = {
    animation: {
        enabled: true ,
        moves: {
            enabled: true ,
            durationMs: 200,
        },
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
        (globalEnabled, animation) => {
            // const isSimple = typeof animation[animationType] === 'boolean'
            return globalEnabled && animation[animationType].enabled === true
        }
    )

export const selectAnimationSetting =
    (animationType: Type<"animation">) => (state: RootState) =>
        state.settings.animation[animationType]
