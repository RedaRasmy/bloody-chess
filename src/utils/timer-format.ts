
export default function timerFormat(ms:number,{
    isPrecise = false
}={}) {
    const totalSeconds = Math.floor(ms / 1000)

    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    const hundredMs = Math.floor((ms % 1000) / 100)

    const basic = `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`
    if (isPrecise) {
        return basic + ':' + hundredMs
    } else return basic
}
