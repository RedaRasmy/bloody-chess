
export default function playSound(name:'move'|'capture') {
    const audio = new Audio('/sounds/'+name+'.mp3')
    audio.volume = 1.0
    audio.play()
}
