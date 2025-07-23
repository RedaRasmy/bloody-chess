import { RootState } from "@/redux/store"
import { List, Primitive } from "@/utils/global-types"


type Value = {
    enabled: boolean
    [key: string]: Primitive | List | Value
}
export type Settings = Record<string, Value>

////

export type SettingsState = RootState['settings']

export type SettingKey = keyof SettingsState

export type SettingValue<S extends SettingKey> = Exclude<
    keyof SettingsState[S],
    "enabled"
>