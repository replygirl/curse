# curse

Recursively, whatever

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

- `arr` will be called on every array, after cursing its values
- `obj` will be called on every non-null object, after cursing its property values
- `prim` will be called on every array, null, or non-object

## License

[ISC (c) 2021 replygirl](https://github.com/replygirl/change-case-object/blob/main/LICENSE.md)
