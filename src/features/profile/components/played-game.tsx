import {type PlayedGame} from '../profile-types'

export default function PlayedGame({
    result ,
    timerOption,
    color 
}:PlayedGame) {
  return (
    <div className="flex items-center justify-between bg-accent rounded-md text-black px-3 py-2">
        <p>{color === 'w' ? 'white' : 'black'}</p>
        <p>{timerOption}</p>
        <p>{result}</p>
    </div>
  )
}
