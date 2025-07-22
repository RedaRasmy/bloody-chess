import { Piece } from "chess.js"
import calculatePoints from "./calculate-points"

export default function getExtraPoints(pieces: Piece[]) {

    const whitePoints = calculatePoints(pieces.filter(p=>p.color==='w'))
    const blackPoints = calculatePoints(pieces.filter(p=>p.color==='b'))

    const whiteExtraPoints =
        whitePoints > blackPoints ? whitePoints - blackPoints : 0
    const blackExtraPoints =
        blackPoints > whitePoints ? blackPoints - whitePoints : 0

    return {
        white: {
            points: whitePoints,
            extraPoints: whiteExtraPoints,
        },
        black: {
            points: blackPoints,
            extraPoints: blackExtraPoints,
        },
    }
}
