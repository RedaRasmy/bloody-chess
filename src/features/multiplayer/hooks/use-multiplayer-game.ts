import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { useEffect, useState, useCallback, useRef, useMemo } from "react"
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
    drawAction,
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

export const useMultiplayerGame = (gameId: string) => {
    const dispatch = useAppDispatch()
    const multiplayerState = useAppSelector((state) => state.multiplayer)
    const playerColor = useAppSelector(selectPlayerColor)
    const player = usePlayer()
    const [isLoading, setIsLoading] = useState(true)
    const [gameStatus, setGameStatus] = useState<GameStatus>("matching")
    const timerOption = useAppSelector(selectTimerOption)
    const isMovesSoundEnabled = useAppSelector(selectIsMovesSoundsEnabled)
    const fen = useAppSelector(selectFEN)
    const [isOpponentOffersDraw, setIsOpponentOffersDraw] = useState(false)
    const [isOpponentOffersRematch, setIsOpponentOffersRematch] = useState(false)

    // Use refs to track the latest values without causing re-renders
    const playerColorRef = useRef(playerColor)
    const fenRef = useRef(fen)
    const isMovesSoundEnabledRef = useRef(isMovesSoundEnabled)
    const isLoadingRef = useRef(isLoading)

    // Update refs when values change
    useEffect(() => {
        playerColorRef.current = playerColor
    }, [playerColor])

    useEffect(() => {
        fenRef.current = fen
    }, [fen])

    useEffect(() => {
        isMovesSoundEnabledRef.current = isMovesSoundEnabled
    }, [isMovesSoundEnabled])

    useEffect(() => {
        isLoadingRef.current = isLoading
    }, [isLoading])

    const handleGameUpdate = useCallback((payload: any) => {
        const newGame = supabaseToTypescript<Game>(payload.new)
        console.log("new game update received:", newGame)
        
        // Only process if not loading to prevent infinite loops
        if (!isLoadingRef.current) {
            const { status, lastMoveAt, gameOverReason } = newGame
            if (
                (status === "playing" && lastMoveAt === null) ||
                (gameOverReason && ["Resignation", "Timeout","Agreement"].includes(gameOverReason))
            ) {
                dispatch(sync(newGame as FinishedGame | StartedGame))
            }
        }
    }, [dispatch])

    const handleMoveUpdate = useCallback((payload: any) => {
        console.log("new move received")
        const newMove = supabaseToTypescript<SMove>(payload.new)
        
        // Process move immediately if it's from opponent
        if (newMove.playerColor !== playerColorRef.current) {
            console.log("run other player move:", newMove)
            dispatch(
                localMove({
                    from: newMove.from,
                    to: newMove.to,
                    promotion: newMove.promotion || undefined,
                })
            )
            
            // Move sound
            if (isMovesSoundEnabledRef.current) {
                const chess = new Chess(fenRef.current)
                const validatedMove = chess.move({
                    from: newMove.from,
                    to: newMove.to,
                    promotion: newMove.promotion ?? undefined,
                })
                playMoveSound(validatedMove, chess.isCheck())
            }
        }
    }, [dispatch])

    const handleDrawOffer = useCallback((payload: any) => {
        console.log('Draw offer received:', payload)
        setIsOpponentOffersDraw(true)
        console.log('the opponent offers draw')
    }, [])

    const handleRematchOffer = useCallback((payload: any) => {
        console.log('Rematch offer received:', payload)
        setIsOpponentOffersRematch(true)
        console.log('the opponent offers rematch')
    }, [])

    const subscriptions = useMemo(() => [
        {
            type: "postgres_changes" as const,
            config: {
                event: "UPDATE" as const,
                schema: "public",
                table: "games",
                filter: `id=eq.${gameId}`,
            },
            callback: handleGameUpdate,
        },
        {
            type: "postgres_changes" as const,
            config: {
                event: "INSERT" as const,
                schema: "public",
                table: "moves",
                filter: `game_id=eq.${gameId}`,
            },
            callback: handleMoveUpdate,
        },
        {
            type: "broadcast" as const,
            config: {
                event: 'draw_offer'
            },
            callback: handleDrawOffer
        },
        {
            type: "broadcast" as const,
            config: {
                event: 'rematch_offer'
            },
            callback: handleRematchOffer
        },
    ], [gameId, handleGameUpdate, handleMoveUpdate, handleDrawOffer, handleRematchOffer])

    const { isSubscribed, connectionStatus, broadcast } = useSupabaseChannel({
        channelName: `game:${gameId}`,
        subscriptions,
        onStatusChange: (status) => {
            console.log("SUBSCRIPTION STATUS:", status)
        }
    })

    // Initialize game setup - only run once when player is ready and subscribed
    useEffect(() => {
        console.log("player.type =", player.type)
        if (player.type !== "loading" && isSubscribed && isLoading) {
            const { data } = player
            async function setState() {
                try {
                    console.log("setting up the game...")
                    const game = await getFullGame(gameId)
                    dispatch(
                        setup({
                            game,
                            playerId: data.id,
                        })
                    )
                    setIsLoading(false)
                    setGameStatus(game.status)
                    console.log("setup done")
                } catch (error) {
                    console.error("Failed to setup game:", error)
                    // Optionally retry or handle error
                }
            }
            setState()
        }
    }, [player.type, isSubscribed, isLoading, gameId, dispatch])

    // Handle ready state - only run when conditions are met
    useEffect(() => {
        if (!isLoading && gameStatus === "preparing" && isSubscribed && playerColor) {
            let isCancelled = false
            
            async function ready() {
                try {
                    console.log("send ready...")
                    await startGame(gameId, playerColor)
                    if (!isCancelled) {
                        console.log("ready sent")
                    }
                } catch (error) {
                    console.error("Failed to send ready:", error)
                }
            }
            ready()
            
            return () => {
                isCancelled = true
            }
        }
    }, [isLoading, isSubscribed, gameStatus, playerColor, gameId])

    const move = async (mv: MoveType) => {
        try {
            await makeMove({
                move: mv,
                gameId,
            })
        } catch (err) {
            console.error(err)
            dispatch(rollback())
            // Reset timings if needed
            if (timerOption) {
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

    const resign = useCallback(async () => {
        try {
            await sendResign(gameId, playerColor)
        } catch (error) {
            console.error(error)
        }
    }, [gameId, playerColor])

    const timeOut = useCallback(async (opponentColor: Color) => {
        try {
            await sendTimeOut(gameId, opponentColor)
        } catch (error) {
            console.error(error)
        }
    }, [gameId])

    const sendDrawOffer = useCallback(async () => {
        broadcast("draw_offer", {
            fromPlayer: playerColor,
            timestamp: Date.now(),
        })
    }, [broadcast, playerColor])

    const sendRematchOffer = useCallback(async () => {
        broadcast("rematch_offer", {
            fromPlayer: playerColor,
            timestamp: Date.now(),
        })
    }, [broadcast, playerColor])

    const rejectDraw = useCallback(() => {
        setIsOpponentOffersDraw(false)
        console.log('reject draw offer')
    }, [])

    const rejectRematch = useCallback(() => {
        setIsOpponentOffersRematch(false)
    }, [])

    const rematch = useCallback(async () => {
        // Implementation needed
    }, [])

    const draw = useCallback(async () => {
        try {
            await drawAction(gameId)
            setIsOpponentOffersDraw(false)
        } catch (error) {
            console.error("Failed to draw:", error)
        }
    }, [gameId])

    console.log('state --- isOpponentOffersDraw :',isOpponentOffersDraw)

    return {
        multiplayerState,
        move,
        playerColor,
        isSetuping: isLoading,
        resign,
        timeOut,
        isSubscribed,
        connectionStatus,
        sendDrawOffer,
        sendRematchOffer,
        isOpponentOffersDraw,
        isOpponentOffersRematch,
        rejectDraw,
        rejectRematch,
        rematch,
        draw
    }
}