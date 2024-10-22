---
title: "Idempotency keys stop duplicate charges"
tags:
  - payment
  - idempotency
---

On a charge endpoint, a retry or a double click can turn one payment into two. The fix is an idempotency key. The caller sends a unique key with the request. We store it the first time we see it, together with the result.

If the same key comes back later (a retry, a double click, a provider re-send), we do not charge again. We just return the result of the first call.

So we do not get duplicate charges and duplicate rows when the network is flaky or someone is impatient and clicks twice. The key has to come from the caller and stay the same across retries. If not, it does nothing.
