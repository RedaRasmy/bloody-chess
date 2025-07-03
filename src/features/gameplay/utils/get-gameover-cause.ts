import { RootState } from "@/redux/store"

export function getGameoverCause({
    isCheckmate,
    isDrawByFiftyMoves,
    isInsufficientMaterial,
    isStalemate,
    isThreefoldRepetition,
    isResign,
    isTimeOut
    
}:RootState['game']['gameOver']) {
    if (isCheckmate) {
        return 'Checkmate'
    } else if (isTimeOut) {
        return "Timeout"
    } else if (isDrawByFiftyMoves) {
        return 'Fifty moves rule'
    } else if (isInsufficientMaterial) {
        return "Insufficient material"
    } else if (isStalemate) {
        return "Stalemate"
    } else if (isThreefoldRepetition) {
        return "Threefold repetition"
    } else if (isResign) {
        return "Resignation"
    }
}