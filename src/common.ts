import type { PromiseType } from 'utility-types'

import { curse } from './curse'
import type { Curse } from './curse'
import { wish } from './wish'
import type { Wish } from './wish'

export interface CurseHandlers<Async extends boolean = false> {
  arr: (x: any[], kp?: string) =>
    Async extends true ? Promise<any> : any
  obj: (x: Record<any, any>, kp?: string) =>
    Async extends true ? Promise<any> : any
  key: (x: string, kp?: string) =>
    Async extends true ? Promise<string> : string
  val: (x: Exclude<any, any[] | object>, kp?: string) =>
    Async extends true ? Promise<any> : any
}

export type WishHandlers = CurseHandlers<true>

export interface Chainable<T = any, R = undefined> {
  curse: (handlers: Partial<CurseHandlers>) => ReturnType<Curse<T, R>>,
  wish: (handlers: Partial<WishHandlers>) => ReturnType<Wish<T, R>>
}

export const attachChainables = <
  T = any,
  R = undefined,
  Async extends boolean = false
>(
  x: Exclude<
    Async extends true
      ? PromiseType<ReturnType<Wish<T, R>>>
      : ReturnType<Curse<T, R>>,
    Chainable<T, R>
  >
): Async extends true
  ? PromiseType<ReturnType<Wish<T, R>>>
  : ReturnType<Curse<T, R>> => {
  if (typeof x === 'object' && x != null)
    // @ts-ignore
    x.curse =
      <R = undefined>(handlers: Partial<CurseHandlers> = {}) =>
        curse<typeof x, R>(x, handlers)
    // @ts-ignore
    x.wish =
      <R = undefined>(handlers: Partial<WishHandlers> = {}) =>
        wish<typeof x, R>(x, handlers)

  return x
}

export const createKeypath = (
  acc: string | null | undefined,
  cur: string | number
) => `${acc ?? ''}${acc ? '.' : ''}${cur}`
