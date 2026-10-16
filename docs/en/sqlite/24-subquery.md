---
language: sqlite
chapter: 24
title: "SQL Subqueries"
level: beginner
minutes: 8
goals:
  - "Use a subquery in WHERE"
  - "Pair IN with a subquery"
  - "Use a subquery in FROM"
sources:
  - sqlite-lang
updated: "2026-10-16"
---

A subquery is a `SELECT` nested inside another statement. It can appear in a comparison, inside `IN`, or in the `FROM` clause.

### A scalar subquery

The inner query returns one number. The outer query compares each price with that number.

```sql run expect="18" title="The maximum"
CREATE TABLE item (price INT);
INSERT INTO item VALUES (18), (6);
SELECT price FROM item WHERE price = (SELECT MAX(price) FROM item);
```

`MAX(price)` is 18, so the outer filter returns `18`.

### IN with a subquery

A name from `item` stays when that same name is listed in `keep`.

```sql run expect="茶" title="The name to keep"
CREATE TABLE item (name TEXT);
CREATE TABLE keep (name TEXT);
INSERT INTO item VALUES ('茶'), ('水');
INSERT INTO keep VALUES ('茶');
SELECT name FROM item WHERE name IN (SELECT name FROM keep);
```

`keep` lists 茶, so the outer query returns `茶`.

### A subquery in FROM

The inner query computes a sum and names the column. The outer query reads that column from the derived table.

```sql run expect="5" title="The inner sum"
SELECT total FROM (SELECT 2 + 3 AS total);
```

The derived column `total` is `5`.
