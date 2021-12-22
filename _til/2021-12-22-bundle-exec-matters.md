---
title: "Why bundle exec actually matters"
tags:
  - ruby
  - bundler
---

I spent too much time on a build that worked for me but broke for a teammate. Same repo, but different output.

The problem was that I ran the tool directly (`jekyll build`). This uses the version that is installed globally. That global version was newer than the version the project pinned.

`bundle exec` runs the command with the versions in Gemfile.lock instead:

```bash
bundle exec jekyll build
```

Now everyone runs the same versions the project agreed on, not the random version on their machine. Lesson: if a project has a Gemfile.lock, put `bundle exec` before Ruby tools.
