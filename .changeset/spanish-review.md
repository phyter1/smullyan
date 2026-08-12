---
'smullyan': minor
---

**Breaking (experimental dialect):** 29 Spanish identifiers renamed following
adversarial review. Notably `obtenerOSino`/`oSino` → `obtenerODefecto`/`oBien`
(`sino` means "but rather"; "otherwise" is `si no`), `todas` → `enParalelo`
(the old name hid that the calls are concurrent), `segun` → `plegar`, and the
`ap`/`apply` mapping, which was inverted.

Also adds a global bijectivity gate: two different concepts sharing one foreign
name now fails the build, because the codemod's rename map is global and would
otherwise translate back to the wrong concept.

Spanish remains `@experimental` and unreviewed by a native speaker.
