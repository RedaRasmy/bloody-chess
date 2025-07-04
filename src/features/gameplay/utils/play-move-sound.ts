import { Move } from "chess.js";
import playSound from "./play-sound";

export function playMoveSound(move:Move,isCheck:boolean) {

    if (isCheck) {
        playSound('check')
        return;
    } else if (move.isCapture()) {
        playSound("capture")
        return;
    } else if (move.isKingsideCastle() || move.isQueensideCastle()) {
        playSound('castle')
        return;
    } else if (move.isPromotion()) {
        playSound("promote")
        return;
    } else {
        playSound('move')
        return;
    }
}