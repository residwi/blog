---
title: "Rewrite the commit author across history"
tags:
  - git
---

I committed a lot of work with the wrong author name, and some with a personal email that I did not want to make public. Fixing the latest commit is easy (`git commit --amend`), but I needed to fix the old ones too.

To rewrite the author on every commit back to the root:

```bash
git rebase -i --root \
  -x "git commit --amend --author 'Your Name <yourname@users.noreply.github.com>' -CHEAD"
```

The `-x` runs that amend on each commit during the rebase. `-CHEAD` reuses the existing commit message, so only the author changes and nothing else.

If you only need to change an email across history, `git filter-branch` (or git-filter-repo) is the bigger tool for that. And use a GitHub noreply email so your real address stays private.
