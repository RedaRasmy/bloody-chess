import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { useEffect, useState } from "react"
import { MoveType } from "../../gameplay/types"
import { setup, sync } from "@/redux/slices/multiplayer/multiplayer-slice"
import {
    move as localMove,
    rollback,
    updateTimings,
} from "@/redux/slices/game/game-slice"
import { FinishedGame, Game, GameStatus, SMove, StartedGame } from "@/db/types"
import { makeMove } from "../../gameplay/server-actions/moves-actions"
import {
    getFullGame,
    sendResign,
    sendTimeOut,
    startGame,
} from "../../gameplay/server-actions/games-actions"
import usePlayer from "./use-player"
import {
    selectFEN,
    selectPlayerColor,
    selectTimerOption,
} from "@/redux/slices/game/game-selectors"
import { supabaseToTypescript } from "@/utils/snake_to_camel_case"
import { Chess, Color } from "chess.js"
import parseTimerOption from "@/features/gameplay/utils/parse-timer-option"
import { selectIsMovesSoundsEnabled } from "@/redux/slices/settings/settings-selectors"
import { playMoveSound } from "@/features/gameplay/utils/play-move-sound"
import { useSupabaseChannel } from "./use-supabase-channel"

// Flow : setup , subscribe to channel -> ready1 -> ready2 -> delay 3s -> play

export const useMultiplayerGame = (gameId: string) => {
    const dispatch = useAppDispatch()
    const multiplayerState = useAppSelector((state) => state.multiplayer)
    const playerColor = useAppSelector(selectPlayerColor)
    const player = usePlayer()
    const [isLoading, setIsLoading] = useState(true)
    const [newGame, setNewGame] = useState<Game | null>(null)
    const [newMove, setNewMove] = useState<SMove | null>(null)
    const [gameStatus, setGameStatus] = useState<GameStatus>("matching")
    const timerOption = useAppSelector(selectTimerOption)
    const isMovesSoundEnabled = useAppSelector(selectIsMovesSoundsEnabled)
    const fen = useAppSelector(selectFEN)

    // Setup channel subscription
    const { isSubscribed, connectionStatus } = useSupabaseChannel({
        channelName: `game:${gameId}`,
        subscriptions: [
            {
                config: {
                    event: "UPDATE",
                    schema: "public",
                    table: "games",
                    filter: `id=eq.${gameId}`,
                },
                callback: (payload) => {
                    const newGame = supabaseToTypescript<Game>(payload.new)
                    console.log("new game update received:", newGame)
                    setNewGame(newGame)
                },
            },
            {
                config: {
                    event: "INSERT",
                    schema: "public",
                    table: "moves",
                    filter: `game_id=eq.${gameId}`,
                },
                callback: (payload) => {
                    console.log("new move received")
                    const newMove = supabaseToTypescript<SMove>(payload.new)
                    setNewMove(newMove)
                },
            },
        ],
        onStatusChange: (status) => {
            console.log("SUBSCRIPTION STATUS:", status)
        },
    })

    useEffect(() => {
        // only for initial sync ( there is no lastMove ) or resignation/timeout
        if (newGame && !isLoading) {
            const { status, lastMoveAt, gameOverReason } = newGame
            if (
                (status === "playing" && lastMoveAt === null) ||
                (gameOverReason &&
                    ["Resignation", "Timeout"].includes(gameOverReason))
            ) {
                dispatch(sync(newGame as FinishedGame | StartedGame))
            }
        }
    }, [newGame, isLoading])

    useEffect(() => {
        if (newGame && newMove) {
            console.log("[✔] Both game + move received.")
            if (newMove.playerColor !== playerColor) {
                console.log("run other player move:", newMove)
                dispatch(
                    localMove({
                        from: newMove.from,
                        to: newMove.to,
                        promotion: newMove.promotion || undefined,
                    })
                )
                // Move sound
                if (isMovesSoundEnabled) {
                    const chess = new Chess(fen)
                    const validatedMove = chess.move({
                        from: newMove.from,
                        to: newMove.to,
                        promotion: newMove.promotion ?? undefined,
                    })
                    playMoveSound(validatedMove, chess.isCheck())
                }
                dispatch(sync(newGame as FinishedGame | StartedGame))
            }
            setNewMove(null)
        }
    }, [newGame, newMove])

    useEffect(() => {
        console.log("player.type =", player.type)
        if (player.type !== "loading" && isSubscribed) {
            const { data } = player
            async function setState() {
                console.log("setting up the game...")
                const game = await getFullGame(gameId)
                dispatch(
                    setup({
                        game,
                        playerId: data.id,
                    })
                )
                setIsLoading(false)
                console.log("setup done")
                setGameStatus(game.status)
            }
            setState()
        }
    }, [player.type, isSubscribed])

    useEffect(() => {
        if (!isLoading && gameStatus === "preparing" && isSubscribed) {
            async function ready() {
                console.log("send ready...")
                await startGame(gameId, playerColor)
                console.log("ready sent")
            }
            ready()
        }
    }, [isLoading, isSubscribed,gameStatus])

    const move = async (mv: MoveType) => {
        try {
            // Insert to Supabase
            await makeMove({
                move: mv,
                gameId,
            })
        } catch (err) {
            console.error(err)
            dispatch(rollback())
            if (newGame) {
                const { status } = newGame
                if (status === "playing" || status === "finished") {
                    dispatch(sync(newGame as FinishedGame | StartedGame))
                }
            } else if (timerOption) {
                // if there is no newGame so we are still in setup
                // reset all timings to setup values
                const { base } = parseTimerOption(timerOption)
                dispatch(
                    updateTimings({
                        blackTimeLeft: base * 1000,
                        whiteTimeLeft: base * 1000,
                        gameStartedAt: null,
                        lastMoveAt: null,
                    })
                )
            }
        }
    }

    async function resign() {
        try {
            await sendResign(gameId, playerColor)
        } catch (error) {
            console.error(error)
        }
    }

    async function timeOut(opponentColor: Color) {
        try {
            // each client check only their opponent timer
            // to prevent race conditions
            await sendTimeOut(gameId, opponentColor)
        } catch (error) {
            console.error(error)
        }
    }

    return {
        multiplayerState,
        move,
        playerColor,
        isSetuping: isLoading,
        resign,
        timeOut,
        isSubscribed,
        connectionStatus,
    }
}
