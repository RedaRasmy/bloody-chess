import { cn } from "@/lib/utils"
import { ChessTimerOption } from "../types"

export default function SelectTimer({value,onChange,options,required=false}:{
    value : ChessTimerOption | null
    onChange : (option:ChessTimerOption | null) => void
    options : ChessTimerOption[]
    required?: boolean
}) {
  return (
    <div className="flex gap-3 flex-wrap">
        <h1 className="">Timer : </h1>
        {
            !required && <div onClick={()=>onChange(null)} className={cn("bg-gray-200 px-2 py-1 rounded-md cursor-pointer",{
                "bg-gray-400" : value === null
            })}>None</div>
        }
        {
            options.map((op) => <div 
                    onClick={()=>onChange(op)} 
                    className={cn("bg-gray-200 px-2 py-1 rounded-md cursor-pointer",{
                        "bg-gray-400" : value === op
                    })} 
                    key={op}
                        >
                        {op.split(' ')[1]}
                    </div>
            )
        }
    </div>
  )
}


