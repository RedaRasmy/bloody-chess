import { BoardElement, CapturedPieces, ChessTimerOption, DetailedPiece, DrawReason, LegalMoves, MoveType, WinReason } from "@/features/gameplay/types"
import { Prettify } from "@/utils/global-types"
import { Color } from "chess.js"

export type GameOverState = {
    isGameOver : true,
    winner : Color,
    isDraw : false
    reason : WinReason
} | {
    isGameOver : true,
    winner : null
    isDraw : true
    reason : DrawReason
} | {
    isGameOver : false
    winner : null
    isDraw : false
    reason : null
}

export type Timings = {
    whiteTimeLeft : number | null
    blackTimeLeft : number | null
    gameStartedAt : number | null
    lastMoveAt : number | null
}

export type History = Prettify<
    MoveType & {
        fenAfter: string
    }
>[]

export type GameState = {
    fen: string;
    history: History;
    currentTurn: Color;
    playerColor: Color;
    currentMoveIndex: number;
    legalMoves: LegalMoves;
    pieces: DetailedPiece[];
    activePiece: BoardElement;
    timerOption: ChessTimerOption | null;
    players: {
        white: {
            name: string;
            timeLeft: number | null;
            capturedPieces: CapturedPieces["w"];
            extraPoints: number;
        };
        black: {
            name: string;
            timeLeft: number | null;
            capturedPieces: CapturedPieces["b"];
            extraPoints: number;
        };
    };
    gameOver: GameOverState;
    newGame: boolean;
    lastMoveAt: number | null;
    gameStartedAt: number | null;
}