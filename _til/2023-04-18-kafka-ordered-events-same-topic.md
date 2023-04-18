---
title: "Events that must stay ordered go in the same Kafka topic"
tags:
  - kafka
  - messaging
---

Kafka only guarantees order inside a single partition. Not across partitions, and for sure not across topics.

We had two event types that must keep a fixed order (something like "created" always before "updated"). They were in separate topics, and consumers sometimes saw them out of order. Of course they did. Kafka never promised this.

The fix: put both types in the same topic and give them the same key. Same key means same partition, and same partition means ordered.

So now my rule is: if A must come before B, they share a topic and a key. If you do not care about their order, separate topics are fine.
