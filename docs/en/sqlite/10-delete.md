---
language: sqlite
chapter: 10
title: "SQL DELETE"
level: beginner
minutes: 8
goals:
  - "Delete the rows that match"
  - "Keep the rows that do not match"
  - "Expect a missing WHERE to empty the table"
sources:
  - sqlite-lang
updated: "2026-10-16"
---

`DELETE` removes whole rows. Change a column with `UPDATE`.

### Delete by a predicate

Remove every row whose price is below 10.

```sql run expect="茶" title="Tea remains"
CREATE TABLE item (name TEXT, price INT);
INSERT INTO item VALUES ('茶', 18), ('水', 6);
DELETE FROM item WHERE price < 10;
SELECT name FROM item;
```

Water is removed, and the surviving name is `茶`.

### Count the rows that remain

Deleting the water row leaves the tea row in place.

```sql run expect="1" title="One row left"
CREATE TABLE item (name TEXT);
INSERT INTO item VALUES ('茶'), ('水');
DELETE FROM item WHERE name = '水';
SELECT COUNT(*) FROM item;
```

After that delete, `COUNT(*)` is `1`.

### Delete every row

A `DELETE` with no `WHERE` removes all rows. The table object remains, with a count of 0.

```sql run expect="0" title="Empty table"
CREATE TABLE item (n INT);
INSERT INTO item VALUES (1);
DELETE FROM item;
SELECT COUNT(*) FROM item;
```

The empty table still exists, and `COUNT(*)` reports `0`.
