
export function compose<T,U,V>(
    f : (x:U) => V,
    g : (x:T) => U
) : (x:T) => V {
    return (x) => f(g(x))
}