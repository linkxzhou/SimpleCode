---
language: sqlite
chapter: 18
title: "SQL JOIN"
level: beginner
minutes: 8
goals:
  - "Match rows with INNER JOIN"
  - "Keep the left table with LEFT JOIN"
  - "Read a null from the right table when nothing matches"
sources:
  - sqlite-lang
updated: "2026-10-16"
---

A join builds a result row from two tables that share a key. The `ON` clause names the columns that must agree.

### An inner join

`JOIN` in this statement is an inner join. A combined row appears only when both tables contain that id.

```sql run expect="tea|2" title="Keys matched"
CREATE TABLE item (id INT, name TEXT);
CREATE TABLE stock (id INT, qty INT);
INSERT INTO item VALUES (1, 'tea');
INSERT INTO stock VALUES (1, 2);
SELECT item.name, stock.qty FROM item JOIN stock ON item.id = stock.id;
```

The shared id produces the row `tea|2`.

### LEFT JOIN keeps the left row

With no partner in the right table, the name from the left table is still returned.

```sql run expect="tea" title="Kept without stock"
CREATE TABLE item (id INT, name TEXT);
CREATE TABLE stock (id INT, qty INT);
INSERT INTO item VALUES (1, 'tea');
SELECT item.name FROM item LEFT JOIN stock ON item.id = stock.id;
```

No stock row shares this id, and the left-hand name is still `tea`.

### An unmatched right column is null

When the join finds no partner, the quantity taken from the right table is NULL.

```sql run expect="1" title="Quantity is null"
CREATE TABLE item (id INT, name TEXT);
CREATE TABLE stock (id INT, qty INT);
INSERT INTO item VALUES (1, 'tea');
SELECT stock.qty IS NULL FROM item LEFT JOIN stock ON item.id = stock.id;
```

`stock.qty IS NULL` evaluates to `1` because the left join found no stock row.
