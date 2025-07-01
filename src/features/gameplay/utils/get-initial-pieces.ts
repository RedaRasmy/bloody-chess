import { Chess } from "chess.js";

export default function getInitialPieces() {
    const chess = new Chess();
    const pieces = chess.board().flat().filter(el => !!el);

    // const pieceCount: Record<string, number> = {};

    return pieces.map((piece,index) => {

        return {
            ...piece,
            id: String(index),
        };
    });
}