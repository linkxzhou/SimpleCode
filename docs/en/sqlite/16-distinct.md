---
language: sqlite
chapter: 16
title: "SQL DISTINCT"
level: beginner
minutes: 8
goals:
  - "Drop duplicate values"
  - "Deduplicate several columns together"
  - "Keep DISTINCT separate from GROUP BY"
sources:
  - sqlite-lang
updated: "2026-10-16"
---

`DISTINCT` keeps a single copy of each repeated result row. Use `GROUP BY` when each key also needs an aggregate.

### Drop duplicates in one column

tea was inserted twice. The distinct list keeps that name once.

```sql run expect="2" title="Two names"
CREATE TABLE item (name TEXT);
INSERT INTO item VALUES ('tea'), ('tea'), ('water');
SELECT COUNT(*) FROM (SELECT DISTINCT name FROM item);
```

Tea and water are the two remaining names, so the outer count is `2`.

### Read one distinct value

Sorting the distinct names makes the first row fixed.

```sql run expect="water" title="First in binary order"
CREATE TABLE item (name TEXT);
INSERT INTO item VALUES ('tea'), ('water'), ('tea');
SELECT name FROM (SELECT DISTINCT name FROM item) ORDER BY name LIMIT 1;
```

Binary order places `water` ahead of tea, and `LIMIT 1` returns that name.

### Deduplicate across two columns

A row counts as a duplicate only when the name and the price both match another row.

```sql run expect="2" title="Two combinations"
CREATE TABLE item (name TEXT, price INT);
INSERT INTO item VALUES ('tea', 18), ('tea', 18), ('tea', 6);
SELECT COUNT(*) FROM (SELECT DISTINCT name, price FROM item);
```

The pair at price 18 collapses to one row and the pair at price 6 stays, so the count is `2`.
