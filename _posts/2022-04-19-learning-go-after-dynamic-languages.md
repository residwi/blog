---
title: "Learning Go after years of dynamic languages"
tags:
  - go
---

I started writing Go about six months ago. At work, the backend ad services are in Go, so I did not really have a choice. Now I am glad about that.

My background is dynamic languages. Years of PHP, and more recently Ruby. So Go was a different way of thinking. This is not a tutorial, just some notes on what I liked and what annoyed me after half a year.

## What I liked

Explicit error handling. In PHP and Ruby I throw and rescue exceptions, and errors can come from anywhere. In Go, a function returns an error as a value, and you handle it right there. At first this felt primitive. Now I find it easier to understand, because I can see exactly where things can go wrong when I read top to bottom.

Zero values. Every type has a good default. A string is `""`, an int is `0`, a bool is `false`, a map or slice starts empty. So you do not get the "undefined variable" surprises I had before. Things are always something.

Goroutines. To start a concurrent task you just write `go doSomething()`. Compared to the hard work I remember from doing concurrency in other places, this felt almost too easy. Channels took me a bit more time to feel comfortable with, but the basic model is nice.

Fast compiles. The compiler is quick, so the feedback loop is short. And it catches many of my mistakes before the code runs, which I did not have with PHP.

Small language. There is not much syntax to learn. I read most of the language in a weekend. After Ruby, where there are five ways to do everything, having one clear way is relaxing.

## What annoyed me

The `if err != nil` thing. Yes, I just said good things about explicit errors. But I also got tired of typing this:

```go
result, err := doSomething()
if err != nil {
    return nil, err
}
```

again and again. The reason is good. But the repetition still tires you after the hundredth time.

Missing conveniences. I came from Ruby, so I kept looking for things that are not there. No `map` or `select` on a slice (you write the loop yourself). No nice one-liners for common collection operations. You write more code to do simple things. The code is clear, but it is more typing.

## Where I am now

I do not love everything about Go, and I do not need to. What I like now is that the code is boring to read, in a good way. There are fewer clever tricks, so when I open a file I wrote three months ago I can actually follow it.

After years of languages that let me be clever, Go mostly stops me. I did not expect to like that.
