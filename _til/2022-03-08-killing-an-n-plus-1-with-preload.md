---
title: "Killing an N+1 with preload"
tags:
  - rails
  - performance
  - postgres
---

A hot read endpoint was slow, and I could not see why from the code. The query log showed me the problem: one query to load the records, then one more query per record to load an association that the access check needed. The classic N+1.

Before:

```ruby
records = Record.where(account_id: account.id)
records.select { |r| r.policy.allows?(user) } # loads r.policy per record
```

After, with `preload` (`includes` works too):

```ruby
records = Record.where(account_id: account.id).preload(:policy)
records.select { |r| r.policy.allows?(user) } # policies already loaded
```

`preload` runs one extra query for all the policies at once, not one query per record. The request went from a long list of repeated queries down to two queries, and it became much faster. The query log found it, not the code.
