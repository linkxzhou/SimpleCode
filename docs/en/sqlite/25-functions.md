---
language: sqlite
chapter: 25
title: "SQL Functions"
level: beginner
minutes: 8
goals:
  - "Use COUNT and SUM"
  - "Use LENGTH and UPPER"
  - "Use ROUND"
sources:
  - sqlite-lang
updated: "2026-10-16"
---

A function may appear in the `SELECT` list. An aggregate reduces many rows to one value. `upper` folds ASCII letters to capitals.

### COUNT and SUM

The two stored prices add up to 24.

```sql run expect="2|24" title="Count and total"
CREATE TABLE item (price INT);
INSERT INTO item VALUES (18), (6);
SELECT COUNT(*), SUM(price) FROM item;
```

`COUNT(*)` is 2 and `SUM(price)` is 24, so the row is `2|24`.

### Length in characters

`length` counts characters in a text value. The two characters in 你好 have length 2.

```sql run expect="2" title="Two characters"
SELECT length('你好');
```

`length('你好')` returns `2`.

### Round to a whole number

`round` with one argument rounds to the nearest whole number and prints that real with one decimal place.

```sql run expect="2.0" title="Rounds to 2"
SELECT round(1.6);
```

`round(1.6)` prints `2.0`.
