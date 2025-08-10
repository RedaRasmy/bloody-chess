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

export const selectAudioSettings = (state: RootState) => state.settings.audio

export const selectIsMovesAudioEnabled = (state: RootState) =>
    state.settings.audio.enabled && state.settings.audio.moves

export const selectIsAudioEnabled =
    (sound: SoundSetting) => (state: RootState) =>
        state.settings.audio[sound]
