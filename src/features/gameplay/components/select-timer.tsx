// import { cn } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { ChessTimerOption } from "../types"
import { TIMER_OPTIONS } from "../utils/constantes"
import TimerOption from "./timer-option"

type Props = (
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
) & {
    className?: string
}

export default function SelectTimer({
    value,
    onChange,
    required = false,
    className,
}: Props) {
    const options = [...TIMER_OPTIONS]

    function handleClick(op: ChessTimerOption) {
        if (required) {
            onChange(op)
        } else {
            if (value === op) {
                // set null if same option clicked twice
                ;(onChange as (option: ChessTimerOption | null) => void)(null)
            } else {
                onChange(op)
            }
        }
    }
    return (
        <div
            className={cn(
                "grid grid-cols-3 grid-rows-3 gap-2 lg:gap-4 ",
                className
            )}
        >
            {options.map((op) => (
                <TimerOption
                    key={op}
                    onClick={() => handleClick(op)}
                    option={op}
                    isSelected={value === op}
                />
            ))}
        </div>
    )
}
