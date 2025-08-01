import { Chess } from "chess.js";
import { MoveType } from "../types";

export default function safeMove(chess:Chess,move:MoveType) {
    try {
        const theMove = chess.move(move)
        return theMove
    } catch (e) {
        console.error("safeMove : ",e)
        return null
    }
}