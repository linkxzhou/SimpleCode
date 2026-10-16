---
language: sqlite
chapter: 20
title: "SQL Aliases"
level: beginner
minutes: 8
goals:
  - "Give a column a short name"
  - "Give a table a short name"
  - "Sort by a column alias"
sources:
  - sqlite-lang
updated: "2026-10-16"
---

An alias gives a later clause a short name for a long expression or a long table. Column aliases and table aliases both use `AS`.

### A column alias

Headers are off in these results, so you see the computed cell.

```sql run expect="5" title="The sum"
SELECT 2 + 3 AS total;
```

`2 + 3` evaluates to `5`.

### A table alias

The short name can stand in front of a column.

```sql run expect="tea" title="Short table name"
CREATE TABLE item (name TEXT);
INSERT INTO item VALUES ('tea');
SELECT i.name FROM item AS i;
```

`i.name` reads the stored name `tea`.

### ORDER BY can use the alias

SQLite lets `ORDER BY` refer to a column alias defined in the `SELECT` list.

```sql run expect="1" title="Order by the alias"
CREATE TABLE item (n INT);
INSERT INTO item VALUES (2), (1);
SELECT n AS v FROM item ORDER BY v LIMIT 1;
```

Sorting on the alias `v` places the smaller number first, which is `1`.
