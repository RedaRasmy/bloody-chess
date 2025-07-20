import { Game } from "@/db/types"
import {
    BoardElement,
    DetailedMove,
    GameOverReason,
    LegalMoves,
    Piece,
    ChessTimerOption,
    MoveType,
} from "@/features/gameplay/types"
import getInitialPieces from "@/features/gameplay/utils/get-initial-pieces"
import getLegalMoves from "@/features/gameplay/utils/get-legal-moves"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Chess, Color, DEFAULT_POSITION } from "chess.js"

type MultiplayerState = {
    gameId: string
    timerOption: ChessTimerOption
    fen: string
    history: DetailedMove[]
    players: {
        white: { id: string; name: string; timeLeft: number }
        black: { id: string; name: string; timeLeft: number }
    }
    currentTurn: Color
    connectionStatus: "connected" | "disconnected" | "reconnecting"
    playerColor: Color // assumes one player
    isPlayerTurn: boolean
    pieces: Piece[]
    activePiece: BoardElement
    // isCheck: boolean
    legalMoves: LegalMoves
    gameOver: {
        isGameOver: boolean
        winner: Color | undefined
        isDraw: boolean
        reason: GameOverReason | undefined
    }
    lastMoveAt: Date | undefined
    lastSyncedMoveIndex: number // for conflict resolution
    pendingMoves: MoveType[] // optimistic updates
}

const initialState: MultiplayerState = {
    gameId: "",
    timerOption: "blitz 3+0",
    fen: DEFAULT_POSITION,
    history: [],
    players: {
        white: { id: "", name: "", timeLeft: 3 * 60 * 1000 },
        black: { id: "", name: "", timeLeft: 3 * 60 * 1000 },
    },
    activePiece: null,
    connectionStatus: "connected",
    currentTurn: "w",
    gameOver: {
        isGameOver: false,
        winner: undefined,
        isDraw: false,
        reason: undefined,
    },
    isPlayerTurn: true,
    lastMoveAt: undefined ,
    lastSyncedMoveIndex: -1,
    legalMoves: {},
    pendingMoves: [],
    pieces: getInitialPieces(),
    playerColor: "w",
}

const multiplayerSlice = createSlice({
    name: "multiplayer",
    initialState,
    reducers: {
        setup: () => {},
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
            state.lastMoveAt = game.lastMoveAt || undefined
            state.legalMoves = getLegalMoves(chess)
        },
    },
})

export const { sync, setup } = multiplayerSlice.actions
export default multiplayerSlice.reducer
