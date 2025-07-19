import {
    BoardElement,
    DetailedMove,
    GameOverReason,
    LegalMoves,
    Piece,
    ChessTimerOption,
    MoveType,
} from "@/features/gameplay/types"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Color, DEFAULT_POSITION } from "chess.js"

type MultiplayerState = {
    gameId: string
    timerOption: ChessTimerOption
    fen: string
    history: DetailedMove[]
    players: {
        white: { id: string; name: string; timeLeft: number }
        black: { id: string; name: string; timeLeft: number }
    }
    currentPlayerId: string
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
    lastMoveAt: number
    lastSyncedMoveIndex: number // for conflict resolution
    pendingMoves: MoveType[] // optimistic updates
}

const initialState:MultiplayerState = {
    gameId : '',
    timerOption : 'blitz 3+0',
    fen : DEFAULT_POSITION,
    history : [],
    players : {
        white : {id:'',name:'',timeLeft:3*60*1000},
        black : {id:'',name:'',timeLeft:3*60*1000}
    },
    activePiece : null,
    connectionStatus : 'connected',
    currentPlayerId : '',
    gameOver : {
        isGameOver : false,
        winner : undefined,
        isDraw : false,
        reason : undefined
    },
    isPlayerTurn : true,
    lastMoveAt : 0,
    lastSyncedMoveIndex : -1,
    legalMoves : {},
    pendingMoves : [],
    pieces : [],
    playerColor : 'w'
}

const multiplayer = createSlice({
    name: "multiplayer",
    initialState,
    reducers: {
        setup : (state,action:PayloadAction<Partial<MultiplayerState>>) => {
            return {
                ...state,
                ...action.payload
            }
        }
    },
})

export const {} = multiplayer.actions
export default multiplayer.reducer

