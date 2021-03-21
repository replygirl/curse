# curse

Recursively transform, search, or whatever else you wanna do to objects, arrays, and primitive values

## Installation

```bash
yarn add @replygirl/curse
```

## Usage

```js
import curse from '@replygirl/curse'

const fooValid = curse(foo, {
  arr: x => x.filter(isValid),
  obj: x => Object.values(x).flat().filter(isValid)
})
```

#### Async

```js
import { wish } from '@replygirl/curse'

const fooHydrated = await wish(foo, {
  val: async x => isValid(x) ? await doSomething(x) : x
})
```

### Handlers

All keys and values can be transformed with handlers of type `(x: T, kp?: string) => any`. `kp` is the keypath from the root object

- `arr` will be called on every array, after cursing its values
- `obj` will be called on every non-null object, after cursing its property values
- `key` will be called on every key of every non-null object
- `val` will be called on every array, null, or non-object

### Chaining

Any returned object can be cursed again with `.curse({ arr?, obj?, key?, val? })` or `.wish({ arr?, obj?, key?, val? })`:

```js
import curse, { wish } from '@replygirl/curse'

const fooData = await curse(foo, {
  arr: x => x.filter(isValid),
  obj: x => Object.values(x).flat().filter(isValid)
}).wish({ val: doSomething })
```

## License

[ISC (c) 2021 replygirl](https://github.com/replygirl/change-case-object/blob/main/LICENSE.md)
