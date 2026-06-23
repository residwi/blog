---
title: "Ignore files in a git repo locally"
tags:
  - git
---

I had a scratch file in a repo, some debugging notes I did not want to commit. Sometimes I added it to `.gitignore`, but I did not want to commit the `.gitignore` change either, so I had to keep that change out of every commit by hand. That was really annoying.

Today I learned about `.git/info/exclude`. It does the same thing but stays on my machine. Same syntax as `.gitignore`. Git ignores those paths for me locally, without me having to commit any changes to the repo.

```bash
echo "NOTES.md" >> .git/info/exclude
echo "docs/" >> .git/info/exclude
```

**Note**: it only works on files git is not already tracking. If a file is already committed, run `git rm --cached` on it first.
