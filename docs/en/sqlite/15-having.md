---
language: sqlite
chapter: 15
title: "SQL HAVING"
level: beginner
minutes: 8
goals:
  - "Filter groups with HAVING"
  - "Separate WHERE from HAVING"
  - "Keep groups whose total clears a threshold"
sources:
  - sqlite-lang
updated: "2026-10-16"
---

`WHERE` drops rows before grouping starts. `HAVING` drops groups after the aggregate is computed.

### Filter after the groups form

Keep a name only when that name occurs more than once.

```sql run expect="茶" title="A repeated name"
CREATE TABLE item (name TEXT);
INSERT INTO item VALUES ('茶'), ('茶'), ('水');
SELECT name FROM item GROUP BY name HAVING COUNT(*) > 1;
```

Water occurs once and is dropped. The remaining name is `茶`.

### WHERE drops rows before the aggregate

Remove water, then count whatever names are left.

```sql run expect="1" title="Filter before the count"
CREATE TABLE item (name TEXT);
INSERT INTO item VALUES ('茶'), ('水');
SELECT COUNT(*) FROM item WHERE name <> '水';
```

The inequality removes the water row, and the remaining count is `1`.

### A threshold on the group total

A group whose prices add up to 10 or less stays out of the result.

```sql run expect="茶" title="Total above ten"
CREATE TABLE item (name TEXT, price INT);
INSERT INTO item VALUES ('茶', 8), ('茶', 8), ('水', 3);
SELECT name FROM item GROUP BY name HAVING SUM(price) > 10;
```

Tea totals 16 and water totals 3, so `HAVING` leaves `茶`.
