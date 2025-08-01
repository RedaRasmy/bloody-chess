import { ChessTimerOption, ColorOption } from "@/features/gameplay/types"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import {
    changeBotTimer,
    changeColor,
    changeLevel,
    selectBotOptions,
} from "@/redux/slices/game-options"
import {
    selectCurrentPlayer,
    selectPlayerColor,
} from "@/redux/slices/game/game-selectors"
import {
    play,
    resign as resignReducer,
    rollback,
} from "@/redux/slices/game/game-slice"
import { Color } from "chess.js"

export default function useBotController() {
    const dispatch = useAppDispatch()
    const options = useAppSelector(selectBotOptions)
    const currentTurn = useAppSelector(selectCurrentPlayer)
    const playerColor = useAppSelector(selectPlayerColor)
    const { level, color, timer } = options
    function resign() {
        dispatch(resignReducer())
    }

    function start() {
        let playerColor: Color = "w"
        if (color == "black") {
            playerColor = "b"
        } else if (color == "random") {
            const randomColor: Color = Math.random() < 0.5 ? "w" : "b"
            playerColor = randomColor
        }
        dispatch(
            play({
                playerName: "player",
                opponentName: `bot - lvl ${level}`,
                playerColor,
                timerOption: timer,
            })
        )
    }

    function setOptions({
        playerColor,
        level,
        timer,
    }: {
        playerColor?: ColorOption
        level?: number
        timer?: ChessTimerOption | null
    }) {
        if (playerColor) {
            dispatch(changeColor(playerColor))
        }
        if (level) {
            dispatch(changeLevel(level))
        }
        if (timer !== undefined) {
            dispatch(changeBotTimer(timer))
        }
    }

    function realUndo() {
        if (currentTurn === playerColor) {
            dispatch(rollback()) // one more rollabck in player-turn case
        }
        dispatch(rollback())
    }

    return {
        start,
        resign,
        setOptions,
        options,
        realUndo,
    }
}
