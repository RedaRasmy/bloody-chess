import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { selectAnimationSettings } from "@/redux/slices/settings/settings-selectors"
import {
    updateMovesAnimation,
    // reset,
} from "@/redux/slices/settings/settings-slice"

export default function useDisplaySettings() {
    const dispatch = useAppDispatch()
    const { moves } = useAppSelector(selectAnimationSettings)

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

    return {
        movesAnimationEnabled: moves.enabled,
        movesAnimationDuration: moves.durationMs,

        toggleMovesAnimation,
        changeMovesDuration,
    }
}
