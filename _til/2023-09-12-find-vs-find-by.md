---
title: "find vs find_by to avoid noisy errors"
tags:
  - rails
---

Our error tracker was full of `RecordNotFound` exceptions. But these cases were fine. A missing row was expected, not a real problem.

The cause was `.find`. In Rails, `.find` raises `RecordNotFound` when the row is not there. Then that exception goes up into the tracker.

If a missing row is a normal result, use `.find_by` instead. It returns `nil`, and you handle the nil yourself:

```ruby
user = User.find_by(id: params[:id])
return head :not_found if user.nil?
```

I changed `.find` to `.find_by` where a missing row is expected. This removed a lot of error noise. Keep `.find` for the cases where a missing row is really a bug.
