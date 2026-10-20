---
language: sqlite
chapter: 26
title: "SQLite common table expressions"
level: intermediate
minutes: 9
goals:
  - "Name one query result with WITH"
  - "Filter that named result again"
  - "Split rows into two bands with CASE"
sources:
  - sqlite-lang
  - quick-sql
updated: "2026-10-20"
---

A common table expression uses `WITH` to prepare a temporary result for the following query. It is not a permanent table. It disappears when the script ends. This chapter does not recurse yet. The SQLite language reference is in the public domain, and the examples were rewritten here. The Quick SQL Cheatsheet is MIT. Its sentences are not copied.

### Only the tea price

`price` holds tea and cup. The outer query keeps tea by name. The price is 4.

```sql run expect="4" title="Price of tea"
WITH price(name, n) AS (
  SELECT 'tea', 4
  UNION ALL
  SELECT 'cup', 2
)
SELECT n FROM price WHERE name = 'tea';
```

The tea price is 4.

### Count the expensive rows

`item` receives three rows. `priced` keeps prices above 3, then counts them. Tea at 4 and pot at 9 qualify. Cup at 2 does not. The count is 2.

```sql run expect="2" title="Two expensive rows"
CREATE TABLE item (name TEXT, price INT);
INSERT INTO item VALUES ('tea', 4), ('cup', 2), ('pot', 9);
WITH priced AS (
  SELECT name FROM item WHERE price > 3
)
SELECT COUNT(*) FROM priced;
```

Two rows are expensive.

### Two bands

A price of 5 or more is labeled `high`. Anything else is `low`. Cup costs 2, so its band is `low`.

```sql run expect="low" title="Cup is low"
CREATE TABLE item (name TEXT, price INT);
INSERT INTO item VALUES ('tea', 4), ('cup', 2);
WITH labeled AS (
  SELECT name,
         CASE WHEN price >= 5 THEN 'high' ELSE 'low' END AS band
  FROM item
)
SELECT band FROM labeled WHERE name = 'cup';
```

The cup band is `low`.

### Exercise: how many rows in each band

Tea at 4 is `low`, pot at 9 is `high`, and cup at 2 is also `low`. Grouping by band shows that `low` has 2 rows. `ORDER BY` keeps `low` in a stable place. The expected substring is `low|2`.

SQL Must Know lists this topic in its catalog. The sentences are not copied: https://book.douban.com/subject/35167240 .

```sql run expect="low|2" title="Two low rows"
CREATE TABLE item (name TEXT, price INT);
INSERT INTO item VALUES ('tea', 4), ('cup', 2), ('pot', 9);
WITH labeled AS (
  SELECT CASE WHEN price >= 5 THEN 'high' ELSE 'low' END AS band
  FROM item
)
SELECT band, COUNT(*) FROM labeled GROUP BY band ORDER BY band;
```

The `low` band has 2 rows.
