---
'smullyan': minor
---

Add `smullyan/agent` — typed, serializable tool calls for agentic systems.

A closed `ToolError` vocabulary whose fields are chosen so that both a program
and a language model can act on them: `RateLimited` carries how long to wait,
`InvalidArgs` carries which argument was wrong, `NotFound` carries near-misses.
`explain` renders any of them as a sentence written for a model to read, and
`parse` validates one back from the wire rather than casting.

Retry, timeout and fallback compose over `Tool<A>` — a thunked `Result` — with
the clock injected rather than reached for, so backoff schedules are pure data
and exactly testable with a fake clock.

Two dialects, one implementation. The readable one wraps every scalar in a
role or unit — `seconds(10)`, `upTo(4).attempts`, `whileTransient` — so a call
site states its own meaning without a signature lookup.
