---
language: sqlite
chapter: 5
title: "SQL SELECT"
level: beginner
minutes: 8
goals:
  - "Project only some columns"
  - "Keep one row with WHERE"
  - "Rename a column with AS"
sources:
  - sqlite-lang
updated: "2026-10-16"
---

`SELECT` chooses which columns appear and which rows survive. The column list is the projection. `WHERE` is the filter.

### A partial column list

A table with two columns can still be read one column at a time.

```sql run expect="tea" title="Name only"
CREATE TABLE item (name TEXT, price INT);
INSERT INTO item VALUES ('tea', 18);
SELECT name FROM item;
```

The projected name is `tea`.

### Keep rows that pass

`WHERE` retains a row only when its condition holds.

```sql run expect="tea" title="The costly row"
CREATE TABLE item (name TEXT, price INT);
INSERT INTO item VALUES ('tea', 18), ('water', 6);
SELECT name FROM item WHERE price > 10;
```

Only the tea row costs more than 10, so the name in the result is `tea`.

### An alias leaves the value unchanged

`AS` attaches a label to a column. With headers off, the visible cell is still the computed value.

```sql run expect="18" title="Column alias"
SELECT 18 AS price;
```

The alias names the column `price`, and the visible value stays `18`.
