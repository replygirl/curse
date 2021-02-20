export interface CurseHandlers {
  arr: (x: any[], k?: string) => any
  obj: (x: Record<any, any>, k?: string) => any
  key: (x: string, k?: string) => string
  val: (x: Exclude<any, any[] | object>, k?: string) => any
}

type Curse<T = any, R = undefined> = (
  x: T,
  { arr, obj, key, val }: Partial<CurseHandlers>,
  pk?: string
) => R extends undefined
  ? typeof x extends any[]
    ? ReturnType<Exclude<typeof arr, undefined>>
    : typeof x extends NonNullable<object>
    ? ReturnType<Exclude<typeof obj, undefined>> & Cursable<T, R>
    : ReturnType<Exclude<typeof val, undefined>>
  : R & Cursable<T, R>

interface Cursable<T = any, R = undefined> {
  curse: (handlers: Partial<CurseHandlers>) => ReturnType<Curse<T, R>>
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
): ReturnType<Curse<T, R>> =>
  Array.isArray(x)
    ? arr(
        x.map(y => curse<typeof y>(y, { arr, obj, key, val }, pk)),
        pk
      )
    : typeof x === 'object' && x != null
    ? {
        ...obj(
          Object.entries(x).reduce(
            (a, [k, v]) => ({
              ...a,
              [key(k)]: curse<typeof v>(
                v,
                { arr, obj, key, val },
                key(k)
              )
            }),
            {}
          ),
          pk
        ),
        curse: (handlers: Partial<CurseHandlers> = {}) =>
          curse<T>(x, handlers)
      }
    : val(x, pk)

const _default = <T = any, R = undefined>(
  x: T,
  handlers: Partial<CurseHandlers> = {}
): ReturnType<Curse<T, R>> => curse<T, R>(x, handlers)

export default _default
