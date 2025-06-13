import { cn } from '@/lib/utils';
import type { Color, Square } from 'chess.js';
import React from 'react'
import { getPieceName } from '../utils/getPieceName';
import Image from 'next/image';
import { BoardElement } from '../types';

export default function Square({color,piece,toMove=false}:{
    color : Color,
    piece : BoardElement,
    toMove?: boolean,
}) {
  return (
    <div className={cn("bg-amber-100 flex justify-center items-center" , {
        'bg-amber-100' : color === 'w',
        'bg-red-700' : color === 'b'
    } )}>
        {piece  && <Piece type={piece.type} color={piece.color} /> }
        {toMove && <div className='size-8 bg-gray-500/60 rounded-full z-10 absolute'/>}
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
        className="cursor-pointer"
    />
}