---
title: "From PHP to Ruby on Rails: what tripped me up"
tags:
  - ruby
  - rails
  - php
---

I wrote PHP for many years. A lot of it with Symfony. Then I changed jobs, and the main app here is Ruby on Rails. So for the last few months I have been learning again how to build web apps.

It is not so hard to be productive in Rails. That is kind of the problem. You become productive before you really understand what is happening. That gap bothered me for a while.

Here is what tripped me up.

## Blocks and implicit returns

Ruby blocks took me more time than I want to say. In PHP I think in functions and explicit returns. In Ruby you pass blocks everywhere, with `do ... end` or curly braces, and methods like `each`, `map`, `select` expect them.

And the last expression in a method is the return value. You do not need the `return` keyword. The first time I read someone's code and there was no `return` anywhere, I really wondered how the method gave back a value. Now I like it, but at first it felt like the code was hiding something from me.

## ActiveRecord and the "magic"

ActiveRecord is the part that impressed me and worried me at the same time.

You define a model, and suddenly it knows how to talk to the database, knows the column names, knows the associations. `User.where(active: true).order(:name)` just works. You can write `user.posts` and it figures out the join.

I came from a world where I wrote more of that by hand. So it felt like too much was happening behind a curtain. I did not trust it. I kept wanting to see the SQL. (You can, with `.to_sql`, which helped me calm down.)

## Convention over configuration

Symfony made me configure a lot. YAML files, annotations, wiring things together. Rails has much less of that. If you name things the right way, it just connects them. The table is `users`, the model is `User`, done.

The good side is clear: less boilerplate. The bad side is that when you do not know the conventions yet, things work by "magic" and you cannot see why. So I spent time learning the conventions, because once you know them, the magic becomes rules again.

## The testing culture

This one surprised me the most. The testing culture here is strong. People write tests as a normal part of the work, not as a boring task you do at the end if there is time. RSpec is everywhere, and the way it reads is closer to plain English than what I knew before.

I did not have the habit to test that much before. Here it is just expected, and honestly it made me slower in a good way. I think more before I write.

## Mixed feelings

I will be honest, I have mixed feelings. I love how fast you can move, and I love how readable Ruby is. But I did not trust all the magic at the start, and a little of that is still here. The difference now is that I looked behind enough curtains to know there is no real magic, just conventions I had not learned yet.

Still learning. But I understand it more than two months ago.
