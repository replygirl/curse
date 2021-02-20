export interface CurseHandlers {
  arr: (x: any[], kp?: string) => any
  obj: (x: Record<any, any>, kp?: string) => any
  key: (x: string, kp?: string) => string
  val: (x: Exclude<any, any[] | object>, kp?: string) => any
}

type Curse<T = any, R = undefined> = (
  x: T,
  { arr, obj, key, val }: Partial<CurseHandlers>,
  kp?: string
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

const createKeypath = (
  acc: string | null | undefined,
  cur: string | number
) => `${acc ?? ''}${acc ? '.' : ''}${cur}`

const curse = <T = any, R = undefined>(
  x: T,
  {
    arr = x => x,
    obj = x => x,
    key = x => x,
    val = x => x
  }: Partial<CurseHandlers> = {},
  kp?: string
): ReturnType<Curse<T, R>> => {
  const y = Array.isArray(x)
    ? arr(
        x.map((y, i) =>
          curse<typeof y>(
            y,
            { arr, obj, key, val },
            createKeypath(kp, i)
          )
        ),
        kp
      )
    : typeof x === 'object' && x != null
    ? obj(
        Object.entries(x).reduce(
          (a, [k, v]) => ({
            ...a,
            [key(k)]: curse<typeof v>(
              v,
              { arr, obj, key, val },
              createKeypath(kp, key(k))
            )
          }),
          {}
        ),
        kp
      )
    : val(x, kp)

  if (typeof y === 'object' && y != null)
    y.curse = <R = undefined>(handlers: Partial<CurseHandlers> = {}) =>
      curse<typeof y, R>(y, handlers)

  return y
}

const _default = <T = any, R = undefined>(
  x: T,
  handlers: Partial<CurseHandlers> = {}
): ReturnType<Curse<T, R>> => curse<T, R>(x, handlers)

export default _default
