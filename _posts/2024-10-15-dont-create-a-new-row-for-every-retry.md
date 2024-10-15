---
title: Don't create a new row for every retry
tags:
  - rails
  - payment
  - idempotency
  - postgres
---

We had a recurring-payment flow in our Rails app. Over a few months, it quietly created thousands of failed transaction rows for only a few users. The database kept growing, and nobody could explain why the transaction table was so big compared to the number of real customers. The cause was a retry loop that made a new row every single time it tried.

## The flow

A recurring charge runs on a schedule. We tell the payment provider to charge the saved payment method, and we record a transaction row for it. Usually it succeeds, and we are done.

Sometimes the provider returns a 5xx. That is not a "the card was declined" answer. It is a "something is broken on our side, try again later" answer. So we retried. Every few minutes, we tried again.

Here is the wrong part. Each retry started from the top of the flow, and the top of the flow created a new transaction row.

```ruby
def charge_recurring(subscription)
  transaction = subscription.transactions.create!(
    amount: subscription.price,
    status: :pending,
  )

  result = provider.charge(transaction)
  transaction.update!(status: result.success? ? :succeeded : :failed)
end
```

So when the provider had a bad hour and returned 5xx for one user, that user got a new failed row every few minutes. A few hours of that is dozens of rows. A provider outage over a full day, across a few unlucky users, is thousands.

## Why this was bad, not only the row count

The bloat was the visible problem, but it pointed to a deeper one. We treated each retry as a brand-new attempt to charge, but it was really the same charge, retried. The state of "this user owes us this month's payment" lived in many rows instead of one. So it was hard to answer simple questions. Has this user been charged this month? Well, there are forty rows, most of them failed, and you have to read all of them to know.

It also meant our retries were not idempotent. An idempotent operation is one you can run many times and get the same effect as running it one time. Creating a row on every attempt is the opposite. Each run leaves another mark.

## The fix

Two changes.

First, stop creating a row per retry. Create the transaction one time, in a `processing` state, and retry against that same row. If the charge fails with a retryable error, leave the row in `processing` and try again later. Move it to `failed` only when we really gave up, and to `succeeded` when it goes through.

```ruby
def charge_recurring(subscription)
  transaction = subscription.transactions.find_or_create_by!(
    period: subscription.current_period,
  ) do |t|
    t.amount = subscription.price
    t.status = :processing
  end

  return if transaction.succeeded?

  result = provider.charge(transaction)
  if result.success?
    transaction.update!(status: :succeeded)
  elsif result.retryable?
    transaction.touch(:last_attempted_at) # stays processing
  else
    transaction.update!(status: :failed)
  end
end
```

The `find_or_create_by!` keyed on the billing period is what keeps it to one row. The first run creates it. Every retry finds the same one. Now there is exactly one row that represents "this user's charge for this period", and its status tells you where it stands.

Second, slow the retries down. Trying again every few minutes during a provider outage is useless, and it just hits them harder. We moved to a backoff: wait a few minutes, then longer, then longer again, up to a cap, and give up after some number of attempts. The provider gets room to recover, and we do not make noise.

## The lesson

Retries should repeat an attempt, not multiply state. If each retry leaves a new row, or some other side effect, then the retry is not really retrying the same operation. It is doing a fresh one each time.

The fix is to have a stable thing for the retry to act on (one row, found by a natural key like the billing period), and to make the operation safe to run again. Add a sensible backoff too, so a bad hour at the provider does not turn into a wall of garbage in your database.
