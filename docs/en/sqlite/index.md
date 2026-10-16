---
language: sqlite
chapter: 0
title: "SQL Tutorial"
minutes: 8
goals:
  - "Print a result with SELECT"
  - "Treat each run as an empty in-memory database"
  - "Leave shell dot-commands out of the script"
sources:
  - sqlite-lang
updated: "2026-10-16"
---

This tutorial runs each script on an in-memory SQLite database. When the script ends, that database is gone. Result columns are separated by a vertical bar.

### No table required

A query can project literals on their own. The string and the number share one result row.

```sql run expect="茶|18" title="One row of literals"
SELECT '茶', 18;
```

The projected row is `茶|18`.

### A fresh database each time

Tables from an earlier script are gone before this one starts. The statement below asks SQLite only for the integer one.

```sql run expect="1" title="This run only"
SELECT 1;
```

The query returns `1`.

### Dot-commands are shell syntax

`.headers` and `.tables` belong to the sqlite3 shell. The Run button executes SQL statements.

```sql norun title="Shell commands"
.headers on
.tables
```

Read `.headers` and `.tables` as sqlite3 shell commands.
