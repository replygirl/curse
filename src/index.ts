export interface CurseHandlers {
  arr: (x: any[], k?: string) => any
  obj: (x: Record<any, any>, k?: string) => any
  key: (x: string, k?: string) => any
  val: (x: Exclude<any, any[] | object>, k?: string) => any
}

const curse = <T = any, R = undefined>(
  x: T,
  {
    arr = x => x,
    obj = x => x,
    key = x => x,
    val = x => x
  }: Partial<CurseHandlers> = {},
  pk?: string
): R extends undefined
  ? typeof x extends any[]
    ? ReturnType<typeof arr>
    : typeof x extends NonNullable<object>
    ? ReturnType<typeof obj>
    : ReturnType<typeof val>
  : R =>
  Array.isArray(x)
    ? arr(
        x.map(y => curse<typeof y>(y, { arr, obj, key, val }, pk)),
        pk
      )
    : typeof x === 'object' && x != null
    ? obj(
        Object.entries(x).reduce(
          (a, [k, v]) => ({
            ...a,
            [key(k)]: curse<typeof v>(v, { arr, obj, key, val }, key(k))
          }),
          {}
        ),
        pk
      )
    : val(x, pk)

const _default = <T = any, R = undefined>(
  x: T,
  {
    arr = x => x,
    obj = x => x,
    key = x => x,
    val = x => x
  }: Partial<CurseHandlers> = {}
) => curse<T, R>(x, { arr, obj, key, val })

export default _default
