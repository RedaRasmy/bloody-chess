import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { selectSettings } from "@/redux/slices/settings/settings-selectors"
import {
    updateMovesAnimation,
    ToggleSound as ToggleSoundReducer,
    reset
} from "@/redux/slices/settings/settings-slice"
import { SoundSetting } from "@/redux/slices/settings/settings-types"

export default function useSettings() {
    const dispatch = useAppDispatch()
    const { animation, sound } = useAppSelector(selectSettings)

    function toggleMovesAnimation() {
        dispatch(
            updateMovesAnimation({
                enabled: !animation.moves.enabled,
            })
        )
    }

    function changeMovesDuration(durationMs: number) {
        dispatch(
            updateMovesAnimation({
                durationMs,
            })
        )
    }
    function resetDefaults() {
        dispatch(reset())
    }

    function toggleSound(sound:SoundSetting) {
        dispatch(ToggleSoundReducer(sound))
    }

    return {
        movesAnimationEnabled: animation.moves.enabled,
        movesAnimationDuration: animation.moves.durationMs,
        sound,
        toggleMovesAnimation,
        toggleSound,
        changeMovesDuration,
        resetDefaults
    }
}
