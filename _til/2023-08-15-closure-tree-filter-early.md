---
title: "closure_tree: filter early"
tags:
  - rails
  - postgres
  - performance
---

In a side project I use the closure_tree gem for hierarchical data in Rails. Methods like `#leaves` and `#hash_tree` are useful, but after I added a scope on top, they became slow.

What I did: build the tree, then filter the result in Ruby. So Postgres did all the hierarchy work for the whole tree, and most of it was thrown away.

The faster way is to push the WHERE into the query, so Postgres filters before the recursive/join work, not after. Much less data goes through the expensive part.

Outside this gem, the lesson is: filter as early in the query as you can, so fewer rows go through the expensive part.
