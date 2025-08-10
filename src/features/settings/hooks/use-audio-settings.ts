import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { selectAudioSettings } from "@/redux/slices/settings/settings-selectors"
import {
    ToggleSound as ToggleSoundReducer,
} from "@/redux/slices/settings/settings-slice"
import { SoundSetting } from "@/redux/slices/settings/settings-types"

export default function useAudioSettings() {
    const dispatch = useAppDispatch()
    const audio = useAppSelector(selectAudioSettings)

    function toggleSound(sound: SoundSetting) {
        dispatch(ToggleSoundReducer(sound))
    }

    return {
        audio,
        toggleSound,
    }
}
