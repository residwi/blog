---
title: "git rebase --autostash"
tags:
  - git
---

Whenever I had to rebase on top of master with a dirty working directory (uncommitted changes), I always did the same four steps:

```bash
git stash
git fetch
git rebase origin/master
git stash pop
```

Today I learned `--autostash` does the stash and pop for me:

```bash
git fetch
git rebase origin/master --autostash
```

It stashes the dirty changes before the rebase and re-applies them right after. You can make it the default for every rebase with:

```bash
git config --global rebase.autostash true
```
