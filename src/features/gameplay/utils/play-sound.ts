import { Sound } from "../types"

export default function playSound(name:Sound) {
    const audio = new Audio('/sounds/'+name+'.mp3')
    audio.volume = 1.0
    audio.play()
}
