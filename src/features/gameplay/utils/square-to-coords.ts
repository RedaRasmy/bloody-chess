import { Square } from "chess.js";

export function squareToCoords(square: Square,isReversed=false): [number, number] {
  const file = square[0]; // e.g. 'e'
  const rank = square[1]; // e.g. '4'

  const x = file.charCodeAt(0) - 'a'.charCodeAt(0); // a=0, b=1, ..., h=7
  const y = 8 - parseInt(rank); // ranks go from 8 (top) to 1 (bottom)

  if (isReversed) return [7-x,7-y]
  return [x, y]; // column, row
}
