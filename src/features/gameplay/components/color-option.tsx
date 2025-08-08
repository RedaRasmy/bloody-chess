import React from 'react'
import { type ColorOption } from '../types'
import { cn } from '@/lib/utils'

export default function ColorOption({
    option,
    isSelected,
    onClick
}:{
    option : ColorOption
    isSelected : boolean
    onClick : ()=>void
}) {

    const color = option === 'white'
        ? 'bg-white'
        : option === 'black'
            ? 'bg-gray-950'
            : "bg-linear-to-r bg-linear-90 from-white  to-gray-950"

  return (
    <div className={cn('rounded-lg hover:bg-accent/5 border-2 border-accent/40 cursor-pointer w-full md:min-w-10 lg:min-w-30 max-w-50 flex items-center gap-1 flex-col  py-4 lg:py-6',{
        "border-primary " : isSelected
    })}
        onClick={onClick}
    >
        <div className={cn(color,"size-8 md:size-10 rounded-full")}/>
        <p className='capitalize font-semibold lg:text-lg '>{option}</p>
    </div>
  )
}
