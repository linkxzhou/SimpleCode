---
language: sqlite
chapter: 21
title: "SQL Indexes"
level: beginner
minutes: 8
goals:
  - "Build an index with CREATE INDEX"
  - "Remember an index does not change the query result"
  - "Filter on the indexed column and read the same row"
sources:
  - sqlite-lang
updated: "2026-10-16"
---

An index speeds up lookup. Given the same rows, the answer of a query stays the same after the index is added.

### Create an index on existing rows

Build the index on a column that already holds data, then read that column's filter again.

```sql run expect="18" title="Still readable"
CREATE TABLE item (name TEXT, price INT);
INSERT INTO item VALUES ('茶', 18);
CREATE INDEX item_name ON item(name);
SELECT price FROM item WHERE name = '茶';
```

After `CREATE INDEX`, the tea price is still `18`.

### The same count without an index

This script never creates an index. The count is the number of inserted rows.

```sql run expect="2" title="Two rows"
CREATE TABLE item (name TEXT);
INSERT INTO item VALUES ('茶'), ('水');
SELECT COUNT(*) FROM item;
```

Two names were inserted, so `COUNT(*)` equals `2`.

### A unique index

A unique index rejects a repeated key. The insert below uses a key that does not collide.

```sql run expect="茶" title="A unique name"
CREATE TABLE item (name TEXT);
CREATE UNIQUE INDEX item_name ON item(name);
INSERT INTO item VALUES ('茶');
SELECT name FROM item;
```

The unique index accepts that insert, and the name reads back as `茶`.
