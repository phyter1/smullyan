---
'smullyan': minor
---

Add eleven combinators to the aviary: Idiot (`I`/`identity`), Kestrel
(`K`/`constant`), Kite (`KI`), Bluebird (`B`/`compose`), Blackbird
(`B1`/`compose2`), Cardinal (`C`/`flip`), Warbler (`W`/`duplicate`), Thrush
(`T`/`applyTo`), Starling (`S`/`ap`), Psi (`P`/`on`), and Phoenix
(`Phi`/`converge`).

Each is curried, exported under its symbol, bird name, and familiar FP name
where one exists, and covered by runtime tests, type-level assertions, and
property-based algebraic laws including the `S K K ≡ I` and `W K ≡ I`
derivations.
