---
title: "Every net/http request runs in its own goroutine"
tags:
  - go
  - concurrency
---

In Go's net/http, the server starts a new goroutine for each incoming request. So your handlers run at the same time by default, even if you never wrote a single `go` statement.

This means any state that a handler touches across requests must be safe for concurrent use. If you share a mutable value (a map, a counter, a cached struct) without a mutex, you will get a data race.

The safe options: keep state per request (local variables, the request context), or protect shared state with a mutex. Before, I thought handlers ran one at a time. They don't.
