---
title: Refactoring a Go service to 90% coverage
tags:
  - go
  - testing
  - refactoring
---

Last quarter I spent some weeks refactoring a Go service that runs behind our ads. It grew the way these services often do: one big package, functions that each did three things, and almost no tests. I wanted to make it easier to change, without feeling scared every time. Along the way, the test coverage went from very low to about 90%. And the tests caught more real bugs than I expected.

## Why I wrote tests at all

The honest answer: I did not trust myself to refactor it safely without them. The service handled real traffic and real money. If I broke something quietly, I would not know until it showed up in a graph.

So before I pulled the functions apart, I wrote tests around the current behavior. Not perfect tests. Just enough to fix what the code did right now. Then I refactored. If a test went red, I knew the refactor changed the behavior, not only the shape. This is the loose version of TDD. I am not writing tests for code that does not exist yet. I am writing them to lock down code that I am about to move around.

## What the tests caught

Three things stand out.

First, nil and empty edge cases. One function took a slice of ad slots and picked the best one. When the slice was empty, it indexed into it and panicked. In production this almost never happened, because there was usually at least one slot. But "almost never" is not "never". The test that passed an empty slice failed loudly. The fix was two lines.

Second, a config path that nobody ever tested. The service read a config value that switched between two pricing modes. One branch ran all the time. The other branch was only used for a special kind of campaign, and it had a bug that was probably there for a year. Nobody noticed, because no test and very little traffic ever hit it. When I wrote a test for that branch, the bug showed up right away.

Third, a crashloop right after a refactor. I split one struct into two. One of the new constructors left a field at its zero value, when it should have been initialized. The service booted fine in most environments, but it crashlooped in one, because that field was dereferenced during startup. A startup test, that only constructed the service and ran its init, caught it before it shipped. Without the test, it would have been a deploy, a crashloop, a rollback, and an afternoon of confusion.

## How tests changed the refactor

The thing I did not expect was how much the tests changed the way I worked, not only the result.

With a test suite that I trusted, I stopped being careful in the slow, nervous way. I started being careful in a faster way. I could rename things, move functions between files, change a signature, then run the tests. Green meant keep going. Red meant look closer. I did many small refactors in a row that I would never try on the old code without tests, because each one was cheap to check.

That changed the pace. Refactoring code without tests feels like walking on ice. Refactoring code with good coverage feels like normal walking.

```go
func TestPickSlot_Empty(t *testing.T) {
    got, err := PickSlot(nil)
    if err == nil {
        t.Fatal("expected error for empty slots, got nil")
    }
    if got != nil {
        t.Fatalf("expected nil slot, got %v", got)
    }
}
```

A test this boring is the kind that catches the panic at 2am.

## The payoff during peak traffic

The payoff showed up during a high-traffic period. The refactored service ran through it without the small errors we used to see. Not because the code was magic now, but because the obvious holes (the nil case, the untested branch, the bad constructor) were already closed before traffic reached them.

I will not say that 90% is a target everyone should hit. The number is not the point. The point is this: writing tests around the behavior before I changed it let me change it a lot. And the bugs it caught were the kind that hide in the paths you never look at.
