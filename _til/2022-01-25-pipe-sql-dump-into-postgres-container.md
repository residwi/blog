---
title: "Pipe a .sql dump into a Postgres container"
tags:
  - postgres
  - docker
---

I needed to load a SQL dump into Postgres that runs under docker compose. The simple pipe:

```bash
cat dump.sql | docker compose exec -T db psql -U postgres -d mydb
```

The part many people miss is `-T`. By default `docker compose exec` allocates a pseudo-TTY, and this breaks the pipe, so psql gets nothing useful. `-T` turns off the TTY, and then the stdin pipe goes through cleanly.

Without it, I always got an empty import and no clear error. With it, the dump loads fine.
