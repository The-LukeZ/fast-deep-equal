# fast-deep-equal

The fastest deep equal with ES6 Map, Set and Typed arrays support — now rewritten in TypeScript with dual ESM/CJS output.

[![npm](https://img.shields.io/npm/v/@lukez/fast-deep-equal.svg)](https://www.npmjs.com/package/@lukez/fast-deep-equal)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

> [!WARNING]
> Since this is a modern rewrite, it may not be compatible with older environments. It could not support Node.js versions below 20, and it may not work in older browsers without polyfills.
> If you need support for older environments, consider using the original [fast-deep-equal](https://github.com/epoberezkin/fast-deep-equal) package.
>
> It is also not a 100% drop-in replacement for the original, as you the default exports have been changed to named exports (`equal` and `reactEqual`). This was done to improve tree-shaking and ESM compatibility, but it may require some changes to your import statements.

## Install

```bash
npm install @lukez/fast-deep-equal
```

## Features

- Written in TypeScript with type definitions included
- Dual ESM + CJS output via [`tsdown`](https://tsdown.dev)
- Requires Node.js 20+
- Checks equality of `Date` and `RegExp` objects by value
- Supports `Map`, `Set`, typed arrays (`Int32Array`, `BigUint64Array`, …)
- React variant skips `_owner` circular references (ported from [react-fast-compare](https://github.com/FormidableLabs/react-fast-compare))

## Usage

```ts
import { equal } from "@lukez/fast-deep-equal";

equal({ foo: "bar" }, { foo: "bar" }); // true
equal(new Int32Array(), new Int32Array()); // true
equal(new Map([["a", 1]]), new Map([["a", 1]])); // true
```

### React

Use the `/react` entry when comparing React elements. It avoids traversing
`_owner`, which contains circular references and is irrelevant for element comparison:

```ts
import { reactEqual } from "@lukez/fast-deep-equal/react";
```

### CJS

```js
const equal = require("@lukez/fast-deep-equal");
const reactEqual = require("@lukez/fast-deep-equal/react");
```

## Performance benchmark

Run it yourself against your own data — the only benchmark that matters is yours:

```bash
pnpm run benchmark # bun can also be used if installed globally
```

**Note:** the bundled benchmark compares against other popular libraries using the
included test fixtures. Results vary by data shape and Node.js version.

## Building from source

```bash
pnpm install
pnpm run build   # outputs to dist/
pnpm test        # runs vitest
```

## License

[MIT](./LICENSE) — © Evgeny Poberezkin (original), © 2026 LukeZ (this fork)
