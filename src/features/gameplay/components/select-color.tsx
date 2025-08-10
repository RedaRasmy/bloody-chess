import { cn } from "@/lib/utils"
import { type ColorOption as ColorType} from "../types"
import ColorOption from "./color-option"

type Props = {
    value: ColorType
    onChange: (option: ColorType) => void
    className?: string
}

export default function SelectColor({ value, onChange, className }: Props) {
    const options:ColorType[] = ['white','black','random']

    return (
        <div
            className={cn(
                "flex gap-2 lg:gap-4 ",
                className
            )}
        >
            {options.map((op) => (
                <ColorOption
                    key={op}
                    onClick={() => onChange(op)}
                    option={op}
                    isSelected={value === op}
                />
            ))}
        </div>
    )
}
