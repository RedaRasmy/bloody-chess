export type Primitive = string | number | boolean
export type List = string[] | number[] | List[]

export type Prettify<T> = {
    [K in keyof T]: T[K]
} & {}

