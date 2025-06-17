export function getGameoverCause({
    isCheckmate,
    isDrawByFiftyMoves,
    isInsufficientMaterial,
    isStalemate,
    isThreefoldRepetition
}:{
    isCheckmate : boolean,
    isDrawByFiftyMoves : boolean,
    isInsufficientMaterial : boolean,
    isStalemate : boolean,
    isThreefoldRepetition : boolean
}) {
    if (isCheckmate) {
        return 'Checkmate'
    } else if (isDrawByFiftyMoves) {
        return 'Fifty moves rule'
    } else if (isInsufficientMaterial) {
        return "Insufficient material"
    } else if (isStalemate) {
        return "Stalemate"
    } else if (isThreefoldRepetition) {
        return "Threefold repetition"
    }
}