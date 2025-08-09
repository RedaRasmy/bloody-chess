import { cn } from '@/lib/utils'
import {type PlayedGame} from '../profile-types'

export default function PlayedGame({
    result ,
    timerOption,
    color 
}:PlayedGame) {
  return (
    <div className="flex items-center justify-between bg-muted rounded-md px-4 lg:px-5 py-3">
        <p>{color === 'w' ? 'white' : 'black'}</p>
        <p>{timerOption}</p>
        <p className={cn('capitalize font-semibold text-green-500',{
          "text-accent" : result === 'lose',
          "text-orange-500" : result === 'draw'
        })}>{result}</p>
    </div>
  )
}
