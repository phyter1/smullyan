---
'smullyan': patch
---

Point `homepage` at the new documentation site, and stop re-exporting the ADTs
as namespaces from the root entry. `export * as Ns` caused the bundler to leak
an internal namespace object into the public API of `smullyan/result`. Import
the ADTs from their subpaths (`smullyan/option`, `smullyan/result`, ...), which
was already the documented preference.
