---
'smullyan': minor
---

Add `pipe` and `flow` at `smullyan/pipe`, with hand-written overload chains
giving exact inference for up to twenty functions. `pipe` threads a value
left to right; `flow` composes functions without supplying a value, and its
first function may take any number of arguments.
