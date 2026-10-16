---
language: sqlite
chapter: 7
title: "SQL WHERE"
level: beginner
minutes: 8
goals:
  - "Filter rows by a number"
  - "Filter rows by text"
  - "Combine two predicates"
sources:
  - sqlite-lang
updated: "2026-10-16"
---

`WHERE` follows `FROM`. A row that fails the predicate is left out of the result.

### A numeric predicate

Keep a name only when its price is greater than 10.

```sql run expect="茶" title="Greater than ten"
CREATE TABLE item (name TEXT, price INT);
INSERT INTO item VALUES ('茶', 18), ('水', 6);
SELECT name FROM item WHERE price > 10;
```

Tea passes that price test, and the returned name is `茶`.

### A text predicate

The `=` operator compares text as well as numbers.

```sql run expect="水" title="Equal to water"
CREATE TABLE item (name TEXT);
INSERT INTO item VALUES ('茶'), ('水');
SELECT name FROM item WHERE name = '水';
```

The row whose name equals `水` is the one returned.

### Two predicates together

`AND` requires the name and the price to match at the same time.

```sql run expect="18" title="Tea above ten"
CREATE TABLE item (name TEXT, price INT);
INSERT INTO item VALUES ('茶', 18), ('茶', 6);
SELECT price FROM item WHERE name = '茶' AND price > 10;
```

The cheap tea row drops out, and the remaining price is `18`.
