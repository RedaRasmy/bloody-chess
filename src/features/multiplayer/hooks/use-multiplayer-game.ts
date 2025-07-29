import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { supabase } from "@/utils/supabase/client"
import { useEffect, useState } from "react"
import { MoveType } from "../../gameplay/types"
import { setup, sync } from "@/redux/slices/multiplayer/multiplayer-slice"
import { move as localMove } from "@/redux/slices/game/game-slice"
import { FinishedGame, Game, SMove, StartedGame } from "@/db/types"
import { makeMove } from "../../gameplay/server-actions/moves-actions"
import {
    getFullGame,
    sendResign,
    sendTimeOut,
    startGame,
} from "../../gameplay/server-actions/games-actions"
import usePlayer from "./use-player"
import {
    // selectGameStartedAt,
    selectPlayerColor,
} from "@/redux/slices/game/game-selectors"
import { supabaseToTypescript } from "@/utils/snake_to_camel_case"
import { Color } from "chess.js"

export const useMultiplayerGame = (gameId: string) => {
    const dispatch = useAppDispatch()
    const multiplayerState = useAppSelector((state) => state.multiplayer)
    const playerColor = useAppSelector(selectPlayerColor)
    // const gameStartedAt = useAppSelector(selectGameStartedAt)
    const player = usePlayer()
    const [isLoading, setIsLoading] = useState(true)
    const [newGame, setNewGame] = useState<Game | null>(null)
    const [newMove, setNewMove] = useState<SMove | null>(null)

    useEffect(() => {
        if (newGame && !isLoading) {
            const { status } = newGame
            if (status === "playing" || status === "finished") {
                dispatch(sync(newGame as FinishedGame | StartedGame))
            }
        }
    }, [newGame, isLoading])

    useEffect(() => {
        if (newGame && newMove) {
            console.log("[✔] Both game + move received.")
            // console.log("sync...")
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
            // dispatch(sync(newGame as StartedGame))
            setNewGame(null)
            setNewMove(null)
            // console.log("sync done")
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
                if (game.status === "preparing") {
                    const playerColor = game.whiteId === data.id ? "w" : "b"
                    await startGame(gameId, playerColor)
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
                    console.log("NEW UPDATE IN [[ GAMES ]] TABEL RECEIVED")
                    const newGame = supabaseToTypescript<Game>(payload.new)
                    console.log("new Game : ", newGame)
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
                    console.log("NEW UPDATE IN [[ MOVES ]] TABEL RECEIVED")
                    const newMove = supabaseToTypescript<SMove>(payload.new)

                    console.log("new move : ", newMove)
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
            console.log("sending move...")
            await makeMove({
                move: mv,
                gameId,
            })
            console.log("move sent")
        } catch (err) {
            console.error(err)
            // TODO!
            //   dispatch(rollbackMove())
        }
    }
    async function resign() {
        try {
            console.log("sending resign...")
            await sendResign(gameId, playerColor)
            console.log("resign sent")
        } catch (error) {
            console.error(error)
        }
    }
    async function timeOut(opponentColor:Color) {
        try {
            // each client check only their opponent timer
            // to prevent race conditions
            console.log("sending timeout...")

            await sendTimeOut(gameId, opponentColor)

            console.log("timout sent")
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
