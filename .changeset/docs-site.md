---
'smullyan': minor
---

**Breaking:** the ADTs are no longer re-exported from the root entry. Import
them from their subpaths instead:

```ts
// before
import { Option, Result } from 'smullyan'

// after
import * as Option from 'smullyan/option'
import * as Result from 'smullyan/result'
```

The birds, `pipe` and `flow` are unaffected and still come from `smullyan`.

`export * as Ns from './x'` made the bundler build a namespace object, place it
in a chunk shared with the `x` entry point, and re-export it from there under a
minified name — leaking `export { … as t }` into the public API of
`smullyan/result`. `publint` and `attw` both pass such an export because it is
structurally valid; it is simply not one anybody wrote. Subpath imports were
already the documented preference, and each ADT defines `map`, `flatMap`,
`match` and `getOrElse`, so a flattened root export was never possible anyway.

Marked `minor` rather than `patch` because 0.1.0 did ship the root re-exports,
so this removes API a consumer could be using. Under semver, 0.x carries
breaking changes in the minor slot.

Also points `homepage` at the new documentation site:
<https://phyter1.github.io/smullyan/>.
