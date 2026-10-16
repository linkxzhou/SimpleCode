---
language: sqlite
chapter: 9
title: "SQL UPDATE"
level: beginner
minutes: 8
goals:
  - "Change a column on one row"
  - "Limit the write with WHERE"
  - "Expect a missing WHERE to rewrite every row"
sources:
  - sqlite-lang
updated: "2026-10-16"
---

`UPDATE` rewrites rows that are already stored. Include a `WHERE` clause unless every row should change.

### Rewrite one cell

Set the tea price to 20.

```sql run expect="20" title="New price"
CREATE TABLE item (name TEXT, price INT);
INSERT INTO item VALUES ('tea', 18);
UPDATE item SET price = 20 WHERE name = 'tea';
SELECT price FROM item;
```

The price cell now holds `20`.

### Leave unmatched rows as they were

The water price is outside this assignment.

```sql run expect="6" title="Water stays"
CREATE TABLE item (name TEXT, price INT);
INSERT INTO item VALUES ('tea', 18), ('water', 6);
UPDATE item SET price = 20 WHERE name = 'tea';
SELECT price FROM item WHERE name = 'water';
```

The `WHERE` clause names only tea, so the water price is still `6`.

### A missing WHERE rewrites every row

The script inserts two prices, then sets every price to 1. Both rows remain, and their prices now add up to 2.

```sql run expect="2" title="Both rows changed"
CREATE TABLE item (price INT);
INSERT INTO item VALUES (18), (6);
UPDATE item SET price = 1;
SELECT SUM(price) FROM item;
```

`SUM(price)` is `2` because each stored price is now 1.
