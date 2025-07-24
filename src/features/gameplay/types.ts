import { Color, PieceSymbol, Square } from "chess.js"
import { GAMEOVER_REASONS, TIMER_OPTIONS } from "./utils/constantes"
import { Prettify } from "@/utils/global-types"

export type BoardElement = {
    square: Square
    type: PieceSymbol
    color: Color
} | null

export type EngineResponse =
    | {
          success: true
          bestmove: string
          eval: number | null
          mate: number | null
          continuation: string
      }
    | {
          success: false
          data: string
      }

export type PromotionPiece = "q" | "n" | "r" | "b"

export type Sound =
    | "move"
    | "check"
    | "castle"
    | "promote"
    | "capture"
    | "game-start"
    | "game-end"

export type CapturedPieces = {
    w: [number, number, number, number, number]
    b: [number, number, number, number, number]
}

export type PlayerData = {
    name: string
    image?: string
}

export type PlayersData = {
    player: PlayerData
    opponent: PlayerData
}

export type MoveType = {
    from: Square
    to: Square
    promotion?: PieceSymbol
}



export type ChessTimer = {
    type: "bullet" | "blitz" | "rapid"
    base: number
    plus: number
}

export type ChessTimerType = "bullet" | "blitz" | "rapid"
export type ChessTimerOption = (typeof TIMER_OPTIONS)[number]

export type WinReason = "Checkmate" | "Resignation" | "Timeout"
export type DrawReason = Exclude<GameOverReason, WinReason>
export type GameOverReason = (typeof GAMEOVER_REASONS)[number]

export type DetailedPiece = {
    id: string
    type: PieceSymbol
    color: Color
    square: Square
}

export type DetailedMove = {
    from: Square
    to: Square
    promotion?: PieceSymbol
    isCapture: boolean
    isKingsideCastle: boolean
    isQueensideCastle: boolean
    captured?: DetailedPiece
}

export type LegalMoves = Partial<
    Record<
        Square,
        {
            from: Square
            to: Square
            promotion: PieceSymbol | undefined
        }[]
    >
>

export type ColorOption = "white" | "random" | "black"
