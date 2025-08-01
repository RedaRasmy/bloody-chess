import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { selectSettings } from "@/redux/slices/settings/settings-selectors"
import {
    updateMovesAnimation,
    updateMovesSound,
    reset
} from "@/redux/slices/settings/settings-slice"

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

    function toggleMovesSound() {
        dispatch(
            updateMovesSound({
                enabled: !sound.moves.enabled,
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

    return {
        movesAnimationEnabled: animation.moves.enabled,
        movesAnimationDuration: animation.moves.durationMs,
        movesSoundsEnabled: sound.moves.enabled,
        toggleMovesAnimation,
        toggleMovesSound,
        changeMovesDuration,
        resetDefaults
    }
}
