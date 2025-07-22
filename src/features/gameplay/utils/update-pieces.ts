import { Square } from "chess.js"
import { DetailedMove, DetailedPiece } from "../types"
import { rank } from "./rank-file"

export default function updatePieces(piecesToUpdate: DetailedPiece[], move: DetailedMove,reversed = false): DetailedPiece[] {
    const {from ,to ,promotion} = move
    const pieces = [...piecesToUpdate]



    if (reversed) {
        // Reverse the move
        const piece = pieces.find((p) => p.square === to)!
        piece.square = from
        // return captured piece to the board
        if (move.captured) {
            pieces.push(move.captured)
        }
        // castling
        else if (move.isKingsideCastle || move.isQueensideCastle) {
            // handle rook move in castling
            const rookFrom = move.isKingsideCastle ? "f" : "d"
            const rookTo = move.isKingsideCastle ? "h" : "a"
            const rookRank = rank(piece.square)
            const rookPiece = pieces.find(
                (p) => p.square === `${rookFrom}${rookRank}`
            )!
            rookPiece.square = `${rookTo}${rookRank}` as Square
        }
        // promotion
        if (promotion) {
            piece.type = "p" // revert to pawn type
        }
        return pieces
    } else {
        const piece = pieces.find((p) => p.square === from)!
        piece.square = to
        // if capture clean
        const output = pieces.filter((p) => p.square !== to || p === piece)
        // castling
        if (move.isKingsideCastle || move.isQueensideCastle) {
            // handle rook move in castling
            const rookFrom = move.isKingsideCastle ? "h" : "a"
            const rookTo = move.isKingsideCastle ? "f" : "d"
            const rookRank = rank(piece.square)
            const rookPiece = pieces.find(
                (p) => p.square === `${rookFrom}${rookRank}`
            )!
            rookPiece.square = `${rookTo}${rookRank}` as Square
        }
        // promotion
        if (promotion) {
            piece.type = promotion 
        }
    
        return output
    }
    

}
