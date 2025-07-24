export type Primitive = string | number | boolean
export type List = string[] | number[] | List[]

export type Prettify<T> = {
    [K in keyof T]: T[K]
} & {}

export type SerializedTimestamps<T> = {
  [K in keyof T]: T[K] extends Date 
    ? number                   
    : T[K] extends object 
    ? SerializedTimestamps<T[K]>  
    : T[K]                        
};