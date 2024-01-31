---
title: "Postgres partial indexes for a WHERE you always use"
tags:
  - postgres
  - performance
---

We had a slow query. It filtered on a column where almost every row had the same value, and only a small part was the one we really wanted. A plain index on that column did not help much, because the index became almost as big as the table. It turns out Postgres lets you index only the rows you care about:

```sql
CREATE INDEX index_identities_on_value
  ON identities (value)
  WHERE identity_type = 'email';
```

The index only stores rows where identity_type = 'email', so it is smaller. And the planner still uses it as long as the query has the same WHERE. The query went from a few seconds to a few milliseconds. One catch: the condition in the query has to match the condition in the index, or Postgres just ignores it.
