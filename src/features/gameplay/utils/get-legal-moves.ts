import { Chess } from "chess.js";

export default function getLegalMoves(chess:Chess) {
    return Object.groupBy(
                chess.moves({ verbose: true }).map((mv) => ({
                    from: mv.from,
                    to: mv.to,
                    promotion: mv.promotion,
                })),
                (move) => move.from
            )
}