import { SMove } from "@/db/types";
import { PieceSymbol } from "chess.js";

export function getCapturedPieces(moves: SMove[]): { white: PieceSymbol[], black: PieceSymbol[] } {
    const captured: { white: PieceSymbol[], black: PieceSymbol[] }  = { white: [], black: [] } ;
    
    moves.forEach(move => {
        if (move.capturedPiece) {
            const opponentColor = move.playerColor === 'w' ? "b" : "w"
            if (opponentColor === 'w') {
                captured.white.push(move.capturedPiece);
            } else {
                captured.black.push(move.capturedPiece);
            }
        }
    });
    
    return captured;
}

export function calculatePoints(capturedPieces: PieceSymbol[]): number {
    const pieceValues = { 'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9, 'k': 0 };
    return capturedPieces.reduce((total, piece) => 
        total + (pieceValues[piece] || 0), 0);
}