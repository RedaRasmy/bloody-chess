import { Color } from "chess.js";

export default function getColorName(color:Color) {
    return color === 'w' ? "white" : "black"
}