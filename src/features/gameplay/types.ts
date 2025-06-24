import { Color, PieceSymbol, Square } from "chess.js"

export type BoardElement =
    | {
          square: Square
          type: PieceSymbol
          color: Color
      }
    | null

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

export type Sound = "move" | "check" | "castle" | "promote" | "capture"


export type CapturedPieces = {
    w: [number,number,number,number,number]
    b: [number,number,number,number,number]
}

export type PlayerData = {
    name : string,
    image?: string
}

export type PlayersData = {
    player : PlayerData
    opponent : PlayerData
}

export type MoveType = {
    from : Square
    to : Square
    promotion?: PieceSymbol
}

export type ChessTimer = {
    base : number
    plus : number
}