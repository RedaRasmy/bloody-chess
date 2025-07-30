import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { supabase } from "@/utils/supabase/client"
import { useEffect, useState } from "react"
import { MoveType } from "../../gameplay/types"
import { setup, sync } from "@/redux/slices/multiplayer/multiplayer-slice"
import {
    move as localMove,
    rollback,
    updateTimings,
} from "@/redux/slices/game/game-slice"
import { FinishedGame, Game, SMove, StartedGame } from "@/db/types"
import { makeMove } from "../../gameplay/server-actions/moves-actions"
import {
    getFullGame,
    sendResign,
    sendTimeOut,
    startGame,
    updateGameStatus,
} from "../../gameplay/server-actions/games-actions"
import usePlayer from "./use-player"
import {
    selectPlayerColor,
    selectTimerOption,
} from "@/redux/slices/game/game-selectors"
import { supabaseToTypescript } from "@/utils/snake_to_camel_case"
import { Color } from "chess.js"
import parseTimerOption from "@/features/gameplay/utils/parse-timer-option"

export const useMultiplayerGame = (gameId: string) => {
    const dispatch = useAppDispatch()
    const multiplayerState = useAppSelector((state) => state.multiplayer)
    const playerColor = useAppSelector(selectPlayerColor)
    const player = usePlayer()
    const [isLoading, setIsLoading] = useState(true)
    const [newGame, setNewGame] = useState<Game | null>(null)
    const [newMove, setNewMove] = useState<SMove | null>(null)
    const timerOption = useAppSelector(selectTimerOption)

    useEffect(() => {
        if (newGame && !isLoading) {
            const { status ,whiteReady,blackReady } = newGame
            if (status === "playing" || status === "finished") {
                dispatch(sync(newGame as FinishedGame | StartedGame))
            } else if (whiteReady && blackReady) {
                newGame.status = 'playing'
                dispatch(sync(newGame as FinishedGame | StartedGame))
                console.log('both players are ready , change game status to playing ...')
                updateGameStatus(newGame.id,'playing')
            }
        }
    }, [newGame, isLoading])

    useEffect(() => {
        if (newGame && newMove) {
            console.log("[✔] Both game + move received.")
            if (newMove.playerColor !== playerColor) {
                console.log("run other player move :", newMove)
                dispatch(
                    localMove({
                        from: newMove.from,
                        to: newMove.to,
                        promotion: newMove.promotion || undefined,
                    })
                )
            }
            setNewMove(null)
        }
    }, [newGame, newMove])

    useEffect(() => {
        console.log("player.type =", player.type)
        if (player.type !== "loading") {
            const { data } = player
            async function setState() {
                console.log("setuping the game ...")
                const game = await getFullGame(gameId)
                dispatch(
                    setup({
                        game,
                        playerId: data.id,
                    })
                )
                setIsLoading(false)
                console.log('setup done')
                if (game.status === "preparing") {
                    console.log('send ready...')
                    const playerColor = game.whiteId === data.id ? "w" : "b"
                    await startGame(gameId, playerColor)
                    console.log('ready sent')
                }
            }
            setState()
        }
    }, [player.type])

    useEffect(() => {
        // Subscribe to game updates
        const channel = supabase
            .channel(`game:${gameId}`)
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "games",
                    filter: `id=eq.${gameId}`,
                },
                (payload) => {
                    const newGame = supabaseToTypescript<Game>(payload.new)
                    console.log('new game update received : ',newGame)
                    setNewGame(newGame)
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "moves",
                    filter: `game_id=eq.${gameId}`,
                },
                (payload) => {
                    console.log('new move received')
                    const newMove = supabaseToTypescript<SMove>(payload.new)
                    setNewMove(newMove)
                }
            )
            .subscribe((status) => {
                console.log("SUBSCRIPTION STATUS : ", status)
            })

        return () => {
            supabase.removeChannel(channel)
        }
    }, [gameId])

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
    }
}
