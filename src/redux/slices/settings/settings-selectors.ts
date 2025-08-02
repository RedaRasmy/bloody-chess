import { RootState } from "@/redux/store"
import { createSelector } from "@reduxjs/toolkit"
import { SettingValue, SoundSetting } from "./settings-types"

export const selectSettings = (state: RootState) => state.settings

export const selectAnimationSettings = (state: RootState) =>
    state.settings.animation

export const selectEnableAnimations = (state: RootState) =>
    state.settings.animation.enabled

export const selectShouldAnimate = (animationKey: SettingValue<"animation">) =>
    createSelector(
        [selectEnableAnimations, selectAnimationSettings],
        (globalEnabled, animation) => {
            // const isSimple = typeof animation[animationType] === 'boolean'
            return globalEnabled && animation[animationKey].enabled === true
        }
    )

export const selectAnimationSetting =
    (animationKey: SettingValue<"animation">) => (state: RootState) =>
        state.settings.animation[animationKey]

export const selectSoundSettings = (state: RootState) => state.settings

export const selectIsMovesSoundsEnabled = (state: RootState) =>
    state.settings.sound.enabled && state.settings.sound.moves

export const selectIsSoundEnabled =
    (sound: SoundSetting) => (state: RootState) =>
        state.settings.sound[sound]
