---
title: "A good circuit-breaker fallback is the last cached response"
tags:
  - resilience
  - caching
---

When a circuit breaker opens because a downstream is failing, you stop calling it for a while so it can recover. The question is what to return in this time.

The easy answer is an error. But for many reads, a little stale response is better than no response. So we started to return the last cached value when the breaker is open.

The user still sees something while the downstream is down, and we do not hit a service that is already struggling. When the breaker closes again, fresh data comes back.

One note: this only makes sense for data where stale is okay. For anything that must be correct right now (balances, stock), an error is the honest answer.
