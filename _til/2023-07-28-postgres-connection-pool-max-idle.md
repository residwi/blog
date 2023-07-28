---
title: "Set max idle connections, not just max open"
tags:
  - postgres
  - performance
  - go
---

Under load we kept getting "bad connection" errors that came and went. The connection pool had a good max open setting, so that was not the problem.

The real problem was the max idle connections, still at the default. So when a burst finished, the pool closed most connections, then opened fresh ones for the next burst. Always open and close, again and again, and some of the reused connections were already dead when we took them.

Setting a good max idle (close to max open here) plus a connection max lifetime fixed it:

```go
db.SetMaxOpenConns(25)
db.SetMaxIdleConns(25)
db.SetConnMaxLifetime(5 * time.Minute)
```

The lifetime matters too, so connections do not live forever and hit server-side timeouts.
