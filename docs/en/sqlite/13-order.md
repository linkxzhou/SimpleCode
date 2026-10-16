---
language: sqlite
chapter: 13
title: "SQL ORDER BY"
level: beginner
minutes: 8
goals:
  - "Sort numbers in ascending order"
  - "Sort numbers in descending order"
  - "Sort text values"
sources:
  - sqlite-lang
updated: "2026-10-16"
---

`ORDER BY` sets the sequence of result rows. `ASC` sorts from low to high. `DESC` sorts from high to low.

### Ascending order

The smallest number is placed on the first row.

```sql run expect="1" title="1 is first"
CREATE TABLE item (n INT);
INSERT INTO item VALUES (3), (1);
SELECT n FROM item ORDER BY n ASC;
```

The first line is `1`. The value 3 follows it on the next line.

### Descending order

The largest number is placed on the first row. `LIMIT 1` keeps only that row.

```sql run expect="3" title="Largest"
CREATE TABLE item (n INT);
INSERT INTO item VALUES (3), (1);
SELECT n FROM item ORDER BY n DESC LIMIT 1;
```

Descending order limited to one row returns `3`.

### Text order

The default collation compares text by binary order. Both names stay in the table, so a count after the sort is still two.

```sql run expect="2" title="Both rows remain"
CREATE TABLE item (name TEXT);
INSERT INTO item VALUES ('水'), ('茶');
SELECT COUNT(*) FROM item ORDER BY name;
```

`ORDER BY` rearranges rows and `COUNT(*)` still reports `2`.
