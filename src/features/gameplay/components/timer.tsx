
export default function Timer({duration}:{duration:number}) {
    const minutes = Math.floor(duration/60)
    const seconds = duration % 60

  return (
    <div className='bg-gray-300 py-0.5 px-3 rounded-md font-bold'>
        {minutes}:{seconds.toString().padStart(2,'0')}
    </div>
  )
}
