---
title: "Rails picks the replica by request method, not by the query"
tags:
  - rails
  - database
---

We had this in `ApplicationRecord` and I was curious how it actually worked:

```ruby
connects_to database: { writing: :primary, reading: :replica }
```

I assumed Rails looked at each query and sent reads to the replica and writes to the primary. It does not. The automatic switching comes from the `DatabaseSelector` middleware, and it decides based on the HTTP request method, not the query:

- `GET` and `HEAD` use the reading (replica) connection.
- everything else (POST, PUT, PATCH, DELETE) uses the writing (primary) connection.

So if a `GET` action runs a write, you get an `ActiveRecord::ReadOnlyError`, even for a tiny update. Usually that means the write does not belong in a GET in the first place, but it caught me off guard the first time.

Docs: [ActiveRecord::Middleware::DatabaseSelector](https://api.rubyonrails.org/classes/ActiveRecord/Middleware/DatabaseSelector.html).
