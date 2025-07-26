import { ChessTimerOption, ColorOption } from "@/features/gameplay/types"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { changeBotTimer, changeColor, changeLevel, selectBotOptions } from "@/redux/slices/game-options"
import { play ,resign as resignReducer} from "@/redux/slices/game/game-slice"

export default function useBotController() {
    const dispatch = useAppDispatch()
    const  options = useAppSelector(selectBotOptions)
    const {level} = options
    function resign() {
        dispatch(resignReducer())
    }

    function start() {
        dispatch(
            play({
                playerName: "player",
                opponentName: `bot - lvl ${level}`,
            })
        )
    }

    function setOptions({
        playerColor ,
        level,
        timer
    }:{
        playerColor?: ColorOption,
        level?: number,
        timer?: ChessTimerOption | null
    }) {
        if (playerColor) {
            dispatch(changeColor(playerColor))
        } 
        if (level) {
            dispatch(changeLevel(level))
        }
        if (timer) {
            dispatch(changeBotTimer(timer))
        }
    }

    return {
        start,
        resign,
        setOptions,
        options
    }
}
