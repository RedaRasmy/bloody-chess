import { Color, PieceSymbol, Square } from "chess.js"

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

export type Sound = "move" | "check" | "castle" | "promote" | "capture" | 'game-start' | 'game-end'

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
    type: "bullet" | "blitz" | "rapid" | "classical"
    base: number
    plus: number
}

export type ChessTimerType = "bullet" | "blitz" | "rapid" | "classical"
export type ChessTimerOption =
    | "bullet 1+0"
    | "bullet 2+1"
    | "blitz 3+0"
    | "blitz 3+2"
    | "blitz 5+0"
    | "blitz 5+3"
    | "rapid 10+0"
    | "rapid 10+5"
    | "rapid 15+10"

export type Piece = {
    id : string,
    type: PieceSymbol
    color: Color,
    square: Square
}

export type DetailedMove = {
    from: Square
    to: Square
    promotion?: PieceSymbol
    isCapture: boolean
    isKingsideCastle: boolean
    isQueensideCastle: boolean
    captured?: Piece
}