---
title: "context.WithTimeout won't stop a blocking call"
tags:
  - go
  - concurrency
---

I thought `context.WithTimeout` would cancel anything when the deadline passed. It does not. It only sends a signal. Your code has to watch the context, or nothing happens:

```go
select {
case <-ctx.Done():
    return ctx.Err()
case res := <-work:
    return res
}
```

If a function just blocks (a tight loop, a library call that ignores context, a syscall that does not take one), the timeout fires, `ctx.Done()` closes, but the blocking call keeps blocking. Nothing stops it.

For a hard wall-clock limit on work that does not check ctx, you need a separate timer and a way to leave or move on. The context alone will not save you here.
