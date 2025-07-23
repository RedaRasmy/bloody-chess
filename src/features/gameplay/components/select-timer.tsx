import { cn } from "@/lib/utils"
import { ChessTimerOption } from "../types"
import { TIMER_OPTIONS } from "../utils/constantes"

type Props =
    | {
          value: ChessTimerOption | null
          onChange: (option: ChessTimerOption | null) => void
          required?: false
      }
    | {
          value: ChessTimerOption
          onChange: (option: ChessTimerOption) => void
          required: true
      }

export default function SelectTimer({
    value,
    onChange,
    required = false,
}: Props) {
    const options = [...TIMER_OPTIONS]
    const handleNoneClick = () => {
        if (!required) {
            (onChange as (option: ChessTimerOption | null) => void)(null)
        }
    }
    return (
        <div className="flex gap-3 flex-wrap">
            <h1 className="">Timer : </h1>
            {!required && (
                <div
                    onClick={handleNoneClick}
                    className={cn(
                        "bg-gray-200 px-2 py-1 rounded-md cursor-pointer",
                        {
                            "bg-gray-400": value === null,
                        }
                    )}
                >
                    None
                </div>
            )}
            {options.map((op) => (
                <div
                    onClick={() => onChange(op)}
                    className={cn(
                        "bg-gray-200 px-2 py-1 rounded-md cursor-pointer",
                        {
                            "bg-gray-400": value === op,
                        }
                    )}
                    key={op}
                >
                    {op.split(" ")[1]}
                </div>
            ))}
        </div>
    )
}
