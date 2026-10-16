---
language: sqlite
chapter: 14
title: "SQL GROUP BY"
level: beginner
minutes: 8
goals:
  - "Count rows for one key"
  - "Sum a column inside each group"
  - "Expect one result row per group"
sources:
  - sqlite-lang
updated: "2026-10-16"
---

`GROUP BY` folds equal keys into one row. An aggregate then runs over the rows that share that key.

### Count rows for one name

The name tea is stored on two rows.

```sql run expect="2" title="Rows named tea"
CREATE TABLE item (name TEXT);
INSERT INTO item VALUES ('tea'), ('tea'), ('water');
SELECT COUNT(*) FROM item WHERE name = 'tea';
```

Filtering to tea and counting those rows yields `2`.

### One result row per name

Each distinct name becomes one output row, with the number of times that name occurs.

```sql run expect="water|1" title="Water appears once"
CREATE TABLE item (name TEXT);
INSERT INTO item VALUES ('tea'), ('tea'), ('water');
SELECT name, COUNT(*) FROM item GROUP BY name ORDER BY name;
```

Binary order prints the water group as `water|1`, then the tea group as `tea|2`.

### Sum inside the group

Prices that share a name are added together.

```sql run expect="18" title="Ten plus eight"
CREATE TABLE item (name TEXT, price INT);
INSERT INTO item VALUES ('tea', 10), ('tea', 8);
SELECT SUM(price) FROM item GROUP BY name;
```

The tea group adds 10 and 8, so `SUM(price)` is `18`.
