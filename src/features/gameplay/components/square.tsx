import { cn } from '@/lib/utils';
import type { Color, PieceSymbol, Square } from 'chess.js';
import React from 'react'
import { getPieceName } from '../utils/getPieceName';
import Image from 'next/image';

export default function Square({color,piece}:{
    color : Color,
    piece : {
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null
}) {
  return (
    <div className={cn("bg-amber-100 flex justify-center items-center" , {
        'bg-amber-100' : color === 'w',
        'bg-red-700' : color === 'b'
    } )}>
        {piece  && <Piece type={piece.type} color={piece.color} /> }
    </div>
  )
}

function Piece({type,color}:{
    type : string // example : p , n , ...
    color : 'w' | 'b'
}) {
    /// black is uppercase , white is lowercase
    const colorName = color == 'b' ? "black" : "white"
    const name = getPieceName(type)

    return <Image
        alt={type} width={55} height={55} src={`/images/chess-pieces/${colorName}-${name}.png`}
        className="cursor-grab"
    />
}