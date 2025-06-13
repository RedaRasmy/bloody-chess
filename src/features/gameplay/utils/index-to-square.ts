import { Square } from "chess.js";

export function indexToSquare(index:number):Square {
    if (
        index < 0 || index > 63 
    ) throw new Error("Invalid square index")


    const files = ['a','b','c','d','e','f','g','h'];
    const file = files[index % 8];               
    const rank = 8 - Math.floor(index / 8);     
    return file + rank as Square;
}