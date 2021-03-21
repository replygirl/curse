import type { PromiseType } from 'utility-types'

import { attachChainables, createKeypath } from './common'
import type { Chainable, WishHandlers } from './common'

export type Wish<T = any, R = undefined> = (
  x: T,
  { arr, obj, key, val }: Partial<WishHandlers>,
  kp?: string
) => R extends undefined
  ? typeof x extends any[]
    ? ReturnType<Exclude<typeof arr, undefined>>
    : typeof x extends NonNullable<object>
    ? Promise<PromiseType<ReturnType<Exclude<typeof obj, undefined>>> & Chainable<T>>
    : ReturnType<Exclude<typeof val, undefined>>
  : Promise<R & Chainable<T, R>>

export const wish = async <T = any, R = undefined>(
  x: T,
  {
    arr = async x => x,
    obj = async x => x,
    key = async x => x,
    val = async x => x
  }: Partial<WishHandlers> = {},
  kp?: string
): Promise<
  PromiseType<ReturnType<Wish<T, R>>>
> => attachChainables<T, R, true>(
  Array.isArray(x)
    ? await arr(
        await Promise.all(x.map((y, i) =>
          wish<typeof y>(
            y,
            { arr, obj, key, val },
            createKeypath(kp, i)
          )
        )),
        kp
      )
    : typeof x === 'object' && x != null
      ? await obj(
          await (await Promise.all(Object.entries(x).map(async ([k, v]) =>
            [await key(k), v]
          ))).reduce(
            async (a, [k, v]) => ({
              ...await a,
              [k]: await wish<typeof v>(
                v,
                { arr, obj, key, val },
                createKeypath(kp, k)
              )
            }),
            Promise.resolve({})
          ),
          kp
        )
      : await val(x, kp)
)

const _default = async <T = any, R = undefined>(
  x: T,
  handlers: Partial<WishHandlers> = {}
): Promise<
  PromiseType<ReturnType<Wish<T, R>>>
> =>
  await wish<T, R>(x, handlers)

export default _default
