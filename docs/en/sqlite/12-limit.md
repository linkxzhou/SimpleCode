---
language: sqlite
chapter: 12
title: "SQL LIMIT"
level: beginner
minutes: 8
goals:
  - "Return only the first few rows"
  - "Skip rows with OFFSET"
  - "Combine LIMIT with ORDER BY"
sources:
  - sqlite-lang
updated: "2026-10-16"
---

`LIMIT` caps how many rows come back. Pair it with `ORDER BY`, because an unsorted table does not promise which rows arrive first.

### Keep a single row

Sort first, then apply the limit. The chosen row is then fixed.

```sql run expect="1" title="Smallest value"
CREATE TABLE item (n INT);
INSERT INTO item VALUES (3), (1), (2);
SELECT n FROM item ORDER BY n LIMIT 1;
```

Ascending order places 1 first, and `LIMIT 1` keeps that row, so the result is `1`.

### Skip with OFFSET

`OFFSET 1` drops the first row of the ordered result before the limit is applied.

```sql run expect="2" title="Second smallest"
CREATE TABLE item (n INT);
INSERT INTO item VALUES (1), (2);
SELECT n FROM item ORDER BY n LIMIT 1 OFFSET 1;
```

The row after 1 is `2`.

### Sum the limited rows

`LIMIT 2` keeps two rows after the sort. Summing that inner result shows which values were kept.

```sql run expect="3" title="1 plus 2"
CREATE TABLE item (n INT);
INSERT INTO item VALUES (1), (2), (9);
SELECT SUM(n) FROM (SELECT n FROM item ORDER BY n LIMIT 2);
```

The inner query keeps 1 and 2, and their sum is `3`.
