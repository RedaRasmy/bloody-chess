import { Color } from "chess.js";

export function promotionRank(playerColor:Color) {
    return playerColor === 'w' ? '8' : '1'
}