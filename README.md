# curse

Recursively transform, search, or whatever else you wanna do to objects, arrays, and primitive values

## Installation

```bash
yarn add @replygirl/curse
```

## Usage

```js
import curse from '@replygirl/curse'

const isString = x => typeof x === 'string'

const strings = curse(foo, {
  arr: x => x.filter(isString),
  obj: x => Object.values(x).flat().filter(isString)
})
```

### Handlers

All keys and values can be transformed with handlers of type `(x: T, k?: string) => any`. `k` is the key of the parent object

- `arr` will be called on every array, after cursing its values
- `obj` will be called on every non-null object, after cursing its property values
- `key` will be called on every key of every non-null object
- `val` will be called on every array, null, or non-object

## License

[ISC (c) 2021 replygirl](https://github.com/replygirl/change-case-object/blob/main/LICENSE.md)
