---
language: sqlite
chapter: 28
title: "SQLite window functions"
level: advanced
minutes: 10
goals:
  - "Number rows by price with ROW_NUMBER"
  - "Handle ties with RANK"
  - "See a per-name total with SUM"
sources:
  - sqlite-lang
updated: "2026-10-20"
---

A window function attaches a number or a total to each row without collapsing the rows into one. `ORDER BY` inside `OVER` decides the numbering. The outer query still needs its own `ORDER BY` so the printed order is stable. This SQLite is 3.26, which has window functions.

### Number by price

Cup costs 2 and tea costs 9. In ascending price order, cup's row number is 1. The outer query sorts by that number, so the first line is `cup|1`.

```sql run expect="cup|1" title="Cup is first"
SELECT name, ROW_NUMBER() OVER (ORDER BY price) AS rn
FROM (
  SELECT 'cup' AS name, 2 AS price
  UNION ALL
  SELECT 'tea', 9
)
ORDER BY rn;
```

The first line is `cup|1`.

### A tie stays at the same rank

The three values of n are 1, 3, and 3. Ranked by n, 1 has rank 1 and both 3s have rank 2. This check looks only at the smallest line, `1|1`.

```sql run expect="1|1" title="Smallest rank"
SELECT n, RANK() OVER (ORDER BY n) AS r
FROM (
  SELECT 1 AS n
  UNION ALL
  SELECT 3
  UNION ALL
  SELECT 3
)
ORDER BY n, r;
```

The first line is `1|1`.

### A total for one name

Tea has quantities 2 and 3, so the window total is 5 and both tea rows carry 5. Cup has 1. After sorting by name and quantity, the text includes `tea|5`.

```sql run expect="tea|5" title="Window total for tea"
SELECT name, SUM(qty) OVER (PARTITION BY name) AS total
FROM (
  SELECT 'tea' AS name, 2 AS qty
  UNION ALL
  SELECT 'tea', 3
  UNION ALL
  SELECT 'cup', 1
)
ORDER BY name, qty;
```

The tea total is 5, visible as `tea|5`.

### Exercise: how many rows are in the whole result

`COUNT(*) OVER ()` has no partition, so every row sees the full row count. Two literal rows both show a window count of 2.

```sql run expect="2" title="Window count of rows"
SELECT COUNT(*) OVER () AS n
FROM (SELECT 1 AS x UNION ALL SELECT 2);
```

The window count is 2.
