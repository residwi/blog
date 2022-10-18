---
title: "Quorum is ceil(N/2)"
tags:
  - distributed-system
---

Quorum is the smallest number of nodes that have to agree before a decision counts. The formula is `ceil(N/2)`:

- 3 nodes need 2
- 5 nodes need 3
- 7 nodes need 4

This is why you almost always want an odd number of nodes. With an even count, the cluster can split into two equal halves. Then no side has a majority, and nobody can make progress (split-brain). An odd count makes sure one side wins.

Going from 3 to 4 nodes does not give you more fault tolerance too. Both can survive one failure. Go from 3 to 5 to really gain something.
