import React from 'react'
import { ChessTimerOption } from '../types'
import parseTimerOption from '../utils/parse-timer-option'
import { Clock, Coffee, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function TimerOption({
    option,
    isSelected,
    onClick
}:{
    option : ChessTimerOption
    isSelected : boolean
    onClick : ()=>void
}) {
    const {base,plus,type} = parseTimerOption(option)

    const Icon = type === 'bullet' ? Zap : type === 'blitz' ? Clock : Coffee
  return (
    <div className={cn('rounded-lg hover:bg-accent/10 px-10 md:px-15 lg:px-10 border-2 border-accent/50  cursor-pointer w-full max-w-70 flex items-center gap-1 flex-col  py-4 lg:py-6',{
        "border-primary bg-primary/30" : isSelected
    })}
        onClick={onClick}
    >
        <Icon color='red'/>
        <p className='font-semibold text-lg'>{base/60}+{plus}</p>
        <p className='text-muted-foreground'>{type}</p>
    </div>
  )
}
