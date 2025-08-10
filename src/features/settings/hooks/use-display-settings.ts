import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { selectAnimationSettings } from "@/redux/slices/settings/settings-selectors"
import {
    updateMovesAnimation,
    ToggleSound as ToggleSoundReducer,
    // reset,
} from "@/redux/slices/settings/settings-slice"
import { SoundSetting } from "@/redux/slices/settings/settings-types"

export default function useDisplaySettings() {
    const dispatch = useAppDispatch()
    const { moves} = useAppSelector(selectAnimationSettings)

    function toggleMovesAnimation() {
        dispatch(
            updateMovesAnimation({
                enabled: !moves.enabled,
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
    // function resetDefaults() {
    //     dispatch(reset())
    // }

    function toggleSound(sound: SoundSetting) {
        dispatch(ToggleSoundReducer(sound))
    }

    return {
        movesAnimationEnabled: moves.enabled,
        movesAnimationDuration: moves.durationMs,
        
        toggleMovesAnimation,
        changeMovesDuration,
    }
}
