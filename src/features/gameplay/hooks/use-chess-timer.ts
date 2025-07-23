// import { useAppDispatch, useAppSelector } from "@/redux/hooks"
// import {
//     selectBlackPlayer,
//     selectCurrentPlayer,
//     selectGameStartedAt,
//     selectIsGameOver,
//     selectIsNewGame,
//     selectLastMoveAt,
//     selectTimerOption,
//     selectWhitePlayer,
// } from "@/redux/slices/game/game-selectors"
// import { Color } from "chess.js"
// import { useEffect } from "react"
// import { useCountdown } from "usehooks-ts"
// import parseTimerOption from "../utils/parse-timer-option"
// import { calculateTimeLeft } from "../utils/calculate-time-left"
// import { updateTimings } from "@/redux/slices/game/game-slice"

// export default function useChessTimer({
//     timeLeft,
//     isRunning,
// }: {
//     timeLeft: number
//     isRunning: boolean
// }) {
//     const timerOption = useAppSelector(selectTimerOption)

//     const { plus, base } = timerOption
//         ? parseTimerOption(timerOption)
//         : { plus: 0, base: 0 }
//     const isGameOver = useAppSelector(selectIsGameOver)
//     const isNewGame = useAppSelector(selectIsNewGame)
//     // const currentPlayer = useAppSelector(selectCurrentPlayer)

//     const [count, { startCountdown, stopCountdown, resetCountdown }] =
//         useCountdown({
//             countStart: timeLeft / 100, // -1 each 100ms
//             intervalMs: 100,
//         })

//     useEffect(() => {
//         if (!isGameOver) {
//             resetCountdown()
//         }
//     }, [isGameOver, timeLeft, isNewGame])

//     useEffect(() => {
//         if (isRunning) {
//             startCountdown()
//         } else {
//             stopCountdown()
//         }
//     }, [isRunning])

//     return {
//          count
//     }
// }
