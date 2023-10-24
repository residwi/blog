---
title: "Go 1.21 added min, max, and clear"
tags:
  - go
---

After I upgraded to Go 1.21, I deleted a few small helper functions. I had been copying them around for years.

`min` and `max` are builtins now. They work on any ordered type and take two or more args:

```go
lo := min(a, b)
hi := max(a, b, c)
```

`clear` is the other one. For a map it removes all keys. For a slice it sets every element to zero (the length stays the same):

```go
clear(m) // empty map
clear(s) // all elements set to zero value
```

Small additions, but nice. No more copy-paste of a `minInt` helper into every project.
