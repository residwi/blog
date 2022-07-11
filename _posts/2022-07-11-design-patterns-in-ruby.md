---
title: "What I took from Design Patterns in Ruby"
tags:
  - ruby
  - design-pattern
  - book
---

I read "Design Patterns in Ruby" recently. It goes through the classic Gang of Four patterns, but written the way you really write them in Ruby, not Java translated word for word. I also used a nice summary by davidgf while reading.

I will not list all the patterns. Half of them I will forget the names by next month anyway. What stayed with me are a few main ideas that sit under all of them.

## The ideas underneath

Separate what changes from what stays the same. Most of these patterns exist to put a wall between the part of your code that keeps changing and the part that does not. Find the thing that changes, isolate it, and the rest of the code stops caring about it.

Program to an interface, not an implementation. Depend on what an object can do, not on what class it is. This makes it easier to change one thing for another later, without rewriting everything around it.

Prefer composition over inheritance. Instead of building tall inheritance trees, give an object the pieces it needs by passing them to it. I heard this before, but the book made me understand why: inheritance ties you down hard, composition leaves you free to move things around.

Delegate. When an object is asked to do something that is not really its job, give it to another object that owns that job. Keep responsibilities where they belong.

You ain't gonna need it (YAGNI). Do not build the flexible, future-proof version until you really have the future problem. Most of the time the future you imagined never comes.

## My main takeaway

The thing I keep coming back to is this: patterns are tools, not goals.

When you first learn patterns, there is a strong wish to use them. You see a factory-shaped hole everywhere. You wrap things in strategies that have exactly one strategy. I did this. It feels smart and it makes the code worse.

The book made me more careful. Only use a pattern when you have the real problem it solves, right now, in front of you. If you use it because it maybe will be useful one day, you just over-engineered the thing and added indirection nobody asked for. That goes back to YAGNI.

## The Ruby part

The book also shows things Ruby gives you that change how some patterns look, or make them not needed.

You can build small DSLs (domain specific languages) because the syntax is flexible enough to read almost like configuration. Metaprogramming lets objects define methods on the fly, so some patterns that exist to work around rigid languages just go away. And convention over configuration, which Rails uses a lot, removes much of the wiring that other languages need patterns for.

So a few patterns from the Java world feel like solutions to problems Ruby does not have.

In general a good read. Not because I will repeat the patterns, but because it made me ask "do I really need this?" before adding structure. That question alone was worth it.
