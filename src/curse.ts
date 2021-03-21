import { attachChainables, createKeypath } from './common'
import type { Chainable, CurseHandlers } from './common'

export type Curse<T = any, R = undefined> = (
  x: T,
  { arr, obj, key, val }: Partial<CurseHandlers>,
  kp?: string
) => R extends undefined
  ? typeof x extends any[]
    ? ReturnType<Exclude<typeof arr, undefined>>
    : typeof x extends NonNullable<object>
    ? ReturnType<Exclude<typeof obj, undefined>> & Chainable<T, R>
    : ReturnType<Exclude<typeof val, undefined>>
  : R & Chainable<T, R>

export const curse = <T = any, R = undefined>(
  x: T,
  {
    arr = x => x,
    obj = x => x,
    key = x => x,
    val = x => x
  }: Partial<CurseHandlers> = {},
  kp?: string
): ReturnType<Curse<T, R>> => attachChainables(
  Array.isArray(x)
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
)

const _default = <T = any, R = undefined>(
  x: T,
  handlers: Partial<CurseHandlers> = {}
): ReturnType<Curse<T, R>> => curse<T, R>(x, handlers)

export default _default
