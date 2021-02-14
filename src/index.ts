interface Handlers<T> {
  arr: (x: T[]) => any
  obj: (x: Record<any, T>) => any
  prim: (x: T) => any
}

const _default = <T = any>(
  x: T,
  {
    arr = (x: T[]) => x,
    obj = (x: Record<any, T>) => x,
    prim = (x: T) => x
  }: Partial<Handlers<T>> = {}
): typeof x extends any[]
  ? ReturnType<typeof arr>
  : typeof x extends NonNullable<object>
  ? ReturnType<typeof obj>
  : ReturnType<typeof prim> =>
  Array.isArray(x)
    ? arr(x.map(y => _default(y, { arr, obj, prim })))
    : typeof x === 'object' && x != null
    ? obj(
        Object.entries(x).reduce(
          (a, [k, v]) => ({
            ...a,
            [k]: _default(v, { arr, obj, prim })
          }),
          {}
        )
      )
    : prim(x)

export default _default
