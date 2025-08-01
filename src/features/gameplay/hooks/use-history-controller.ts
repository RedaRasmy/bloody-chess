import { useAppDispatch } from "@/redux/hooks"
import {
    undo as undoReducer,
    redo as redoReducer,
    undoToStart as undoToStartReducer,
    redoToEnd as redoToEndReducer,
} from "@/redux/slices/game/game-slice"

export default function useHistoryController() {
    const dispatch = useAppDispatch()

    function undoToStart() {
        dispatch(undoToStartReducer())
    }
    function undo() {
        dispatch(undoReducer())
    }
    function redo() {
        dispatch(redoReducer())
    }
    function redoToEnd() {
        dispatch(redoToEndReducer())
    }

    return {
        undo,
        redo,
        undoToStart,
        redoToEnd,
    }
}
