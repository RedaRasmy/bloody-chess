import { FullGame, Game, SMove } from "@/db/types"
import {
    BoardElement,
    DetailedMove,
    GameOverReason,
    LegalMoves,
    Piece,
    ChessTimerOption,
    MoveType,
} from "@/features/gameplay/types"
import getPieces from "@/features/gameplay/utils/get-pieces"
import getLegalMoves from "@/features/gameplay/utils/get-legal-moves"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Chess, Color, DEFAULT_POSITION } from "chess.js"

type ConnectionStatus = "connected" | "disconnected" | "reconnecting"

const initialState = {
    gameId: "",
    timerOption: "blitz 3+0" as ChessTimerOption,
    fen: DEFAULT_POSITION,
    history: [] as SMove[],
    players: {
        white: { id: "", name: "", timeLeft: 3 * 60 * 1000 },
        black: { id: "", name: "", timeLeft: 3 * 60 * 1000 },
    },
    connectionStatus: "connected" as ConnectionStatus,
    currentTurn: "w" as Color,
    gameOver: {
        isGameOver: false,
        winner: undefined as Color | undefined,
        isDraw: false,
        reason: undefined as GameOverReason | undefined,
    },
    isPlayerTurn: true,
    lastMoveAt: null as Date | null,
    // lastSyncedMoveIndex: -1,
    legalMoves: {} as LegalMoves,
    pieces: getPieces(),
    playerColor: "w" as Color,
    /// CLIENT ONLY
    activePiece: null as BoardElement,
    pendingMoves: [] as MoveType[],
}

const multiplayerSlice = createSlice({
    name: "multiplayer",
    initialState,
    reducers: {
        setup: (
            state,
            action: PayloadAction<{ game: FullGame; playerId: string }>
        ) => {
            const { game, playerId } = action.payload
            const whiteName = game.isForGuests
                ? game.white.displayName
                : game.white.username
            const blackName = game.isForGuests
                ? game.black.displayName
                : game.black.username
            const playerColor = game.whiteId === playerId ? "w" : "b"

            //

            state.gameId = game.id
            state.timerOption = game.timer
            state.fen = game.currentFen
            state.history = game.moves
            state.players = {
                white: {
                    id: game.whiteId,
                    name: whiteName,
                    timeLeft: game.whiteTimeLeft,
                },
                black: {
                    id: game.blackId,
                    name: blackName,
                    timeLeft: game.blackTimeLeft,
                },
            }
            state.currentTurn = game.currentTurn
            state.lastMoveAt = game.lastMoveAt
            state.legalMoves = getLegalMoves(new Chess(game.currentFen))
            state.pieces = getPieces(game.currentFen)
            state.playerColor = playerColor
            state.isPlayerTurn = playerColor === game.currentTurn
        },
        sync: (state, action: PayloadAction<Game>) => {
            const game = action.payload
            const chess = new Chess(game.currentFen)

            state.fen = game.currentFen
            state.players.white.timeLeft = game.whiteTimeLeft
            state.players.black.timeLeft = game.blackTimeLeft
            state.currentTurn = game.currentTurn
            state.gameOver = {
                isGameOver: game.status === "finished",
                isDraw: game.result === "draw",
                reason: game.gameOverReason || undefined,
                winner:
                    game.result === "white_won"
                        ? "w"
                        : game.result === "black_won"
                        ? "b"
                        : undefined,
            }
            state.isPlayerTurn = state.playerColor === game.currentTurn
            state.lastMoveAt = game.lastMoveAt
            state.legalMoves = getLegalMoves(chess)
        },
    },
})

export const { sync, setup } = multiplayerSlice.actions
export default multiplayerSlice.reducer
