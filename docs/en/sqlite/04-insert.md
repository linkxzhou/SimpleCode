---
language: sqlite
chapter: 4
title: "SQL INSERT"
level: beginner
minutes: 8
goals:
  - "Insert into named columns"
  - "Insert several rows in one statement"
  - "Leave an omitted column null"
sources:
  - sqlite-lang
updated: "2026-10-16"
---

`INSERT` adds rows to a table that already exists. Name the columns when the values are not in table order.

### Name the columns

The column list and the `VALUES` list line up position by position.

```sql run expect="水" title="Swapped column order"
CREATE TABLE item (name TEXT, price INT);
INSERT INTO item (price, name) VALUES (6, '水');
SELECT name FROM item;
```

The name supplied in `VALUES` is stored as `水`.

### Several rows in one statement

Each parenthesized group is one row. `COUNT(*)` reports how many rows the table holds.

```sql run expect="2" title="Two rows"
CREATE TABLE item (name TEXT);
INSERT INTO item VALUES ('茶'), ('水');
SELECT COUNT(*) FROM item;
```

Two groups were inserted, so the count is `2`.

### An omitted column is null

A column left out of the insert is NULL. `IS NULL` returns 1 for that cell.

```sql run expect="1" title="No unit price"
CREATE TABLE item (name TEXT, price INT);
INSERT INTO item (name) VALUES ('茶');
SELECT price IS NULL FROM item;
```

No price was supplied, so `price IS NULL` is `1`.
