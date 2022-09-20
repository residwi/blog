---
title: "Pairing and TDD changed how I work"
tags:
  - tdd
  - pair-programming
  - xp
---

The team I joined practices Extreme Programming, or XP. For me, in practice, that mostly meant two things: pair programming and test-driven development. I had not done either one in a serious way before. A few months later, both changed how I work, and I have feelings about it.

## Pairing, the hard parts first

I will start with the honest part. Pairing was exhausting at the beginning.

It matters how we pair, because it shapes the whole thing: we are fully remote. The team has worked from home since the pandemic, so none of this is shoulder to shoulder. We pair over Google Meet, one person shares their screen, and we talk it through on the call and in Slack. The keyboard moves when someone just says "okay, you drive." Pairing online has its own friction too: you cannot point at the screen, so you describe where to go out loud, and there is always a little lag.

Two brains, one task, and you cannot zone out. You cannot quietly google something for ten minutes while you figure out what you are doing. You have to think out loud all the time, and that is tiring when you are not used to it.

It also felt slow. Two people, one task, so that is half the speed, no? That was my math at first.

And you cannot hide. If I do not understand something, my pair knows it immediately, because I have to explain my reasoning while I go, and it falls apart out loud. As the newer person on the team, that was uncomfortable. I wanted to look like I knew things.

## Why I changed my mind

A few things changed my mind.

It caught bugs early. Not in code review days later, but in the moment, before the bad idea was even typed. My pair would say "wait, what about an empty list?" and we handled it right then.

It spread knowledge fast. I learned the codebase, the tools, the team's habits, much faster than alone. And it goes both ways, so I was not just taking.

And explaining my thinking out loud made me think more clearly. When you have to say why you do something, you notice when the why is weak. Many of my bad ideas died the moment I tried to say them to another person.

It is still tiring. I just think the tiredness gives something back now.

## TDD

Test-driven development was the other change. The loop is red, green, refactor: write a failing test, write the smallest code to make it pass, then clean it up.

Writing the test first felt backwards. How do I test something that does not exist yet? But that is kind of the point. Writing the test makes you decide what the thing should do before you build it. The test becomes a design tool, not just a check at the end.

The part I did not expect to value so much is the confidence to refactor. With a wall of tests behind me, I can break a piece of code apart and move it around, and if I break something the tests tell me right away. Before, I was scared to touch working code. Now I am much less scared.

## Mixed feelings, still

I do not want this to sound like I converted and now I love everything. Pairing all day still drains me. Sometimes I miss working alone with my own thoughts. And TDD slows the start of a task, even if it speeds up the end.

But I write better code now, and I understand it better, and I trust it more. So I do not argue with the method anymore. I am just learning to do it with less resistance.
