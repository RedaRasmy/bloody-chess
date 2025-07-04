import { SQUARES } from "chess.js";

export default function getSquares(isReversed: boolean = false) {
    if (isReversed) {
        return [...SQUARES].reverse()
    } else {
        return SQUARES
    }
}
