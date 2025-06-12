
export function getPieceName(character:string):string {
    switch (character.toLowerCase()) {
        case "k" : return 'king'
        case "q" : return 'queen'
        case 'r' : return 'rook'
        case 'b' : return 'bishop'
        case 'n' : return 'knight'
        case 'p' : return 'pawn'
        default : throw new Error("invalid piece character")
    }
}
