import { Chess, DEFAULT_POSITION } from "chess.js";

export default function getPieces(fen=DEFAULT_POSITION) {
    const chess = new Chess(fen);
    const pieces = chess.board().flat().filter(el => !!el);

    // const pieceCount: Record<string, number> = {};

    return pieces.map((piece,index) => {

        return {
            ...piece,
            id: String(index),
        };
    });
}