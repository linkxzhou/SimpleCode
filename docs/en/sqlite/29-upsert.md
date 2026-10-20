---
language: sqlite
chapter: 29
title: "SQLite UPSERT"
level: intermediate
minutes: 9
goals:
  - "Overwrite with the new value on a conflict"
  - "Add the new value to the old one"
  - "Keep the original row when told to do nothing"
sources:
  - sqlite-lang
updated: "2026-10-20"
---

`INSERT ... ON CONFLICT` updates or ignores a row when a unique key collides. The table needs a primary key or a unique constraint. Otherwise there is no conflict to handle. `excluded` names the row that did not get inserted.

### Overwrite with 5

Tea starts at quantity 2. Inserting the same primary key with quantity 5 takes the conflict branch and sets the quantity from `excluded.qty`. The read is 5.

```sql run expect="5" title="Overwrite the quantity"
CREATE TABLE stock (sku TEXT PRIMARY KEY, qty INT);
INSERT INTO stock VALUES ('tea', 2);
INSERT INTO stock (sku, qty) VALUES ('tea', 5)
  ON CONFLICT(sku) DO UPDATE SET qty = excluded.qty;
SELECT qty FROM stock WHERE sku = 'tea';
```

After the overwrite the quantity is 5.

### Add onto the old quantity

The start is still 2. On conflict the new 3 is added. Two plus three is 5. `stock.qty` is the row already stored. `excluded.qty` is the row that was offered.

```sql run expect="5" title="Add 3"
CREATE TABLE stock (sku TEXT PRIMARY KEY, qty INT);
INSERT INTO stock VALUES ('tea', 2);
INSERT INTO stock (sku, qty) VALUES ('tea', 3)
  ON CONFLICT(sku) DO UPDATE SET qty = stock.qty + excluded.qty;
SELECT qty FROM stock WHERE sku = 'tea';
```

After the addition the quantity is 5.

### A conflict changes nothing

`DO NOTHING` keeps the original 2. The offered 9 is discarded.

```sql run expect="2" title="Stay at 2"
CREATE TABLE stock (sku TEXT PRIMARY KEY, qty INT);
INSERT INTO stock VALUES ('tea', 2);
INSERT INTO stock (sku, qty) VALUES ('tea', 9)
  ON CONFLICT(sku) DO NOTHING;
SELECT qty FROM stock WHERE sku = 'tea';
```

The quantity is still 2.

### Exercise: a new sku is inserted

Tea already exists. Cup is a new primary key, so it does not conflict. After the insert the table has 2 rows.

```sql run expect="2" title="Two stock rows"
CREATE TABLE stock (sku TEXT PRIMARY KEY, qty INT);
INSERT INTO stock VALUES ('tea', 2);
INSERT INTO stock (sku, qty) VALUES ('cup', 1)
  ON CONFLICT(sku) DO UPDATE SET qty = excluded.qty;
SELECT COUNT(*) FROM stock;
```

The row count is 2.
