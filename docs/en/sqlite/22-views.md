---
language: sqlite
chapter: 22
title: "SQL Views"
level: beginner
minutes: 8
goals:
  - "Save a query with CREATE VIEW"
  - "Query a view as if it were a table"
  - "Remember a view does not store a second copy of the data"
sources:
  - sqlite-lang
updated: "2026-10-16"
---

A view is a named `SELECT`. When the base table changes, a later query through the view sees the new rows.

### Save the query

The view keeps names whose price is greater than 10.

```sql run expect="tea" title="The costly view"
CREATE TABLE item (name TEXT, price INT);
INSERT INTO item VALUES ('tea', 18), ('water', 6);
CREATE VIEW dear AS SELECT name FROM item WHERE price > 10;
SELECT name FROM dear;
```

Selecting from `dear` returns `tea`.

### New base rows appear in the view

Insert another expensive item after the view exists. The view picks it up on the next read.

```sql run expect="2" title="Two rows"
CREATE TABLE item (name TEXT, price INT);
INSERT INTO item VALUES ('tea', 18);
CREATE VIEW dear AS SELECT name FROM item WHERE price > 10;
INSERT INTO item VALUES ('pot', 30);
SELECT COUNT(*) FROM dear;
```

tea and pot both cost more than 10, so the view's `COUNT(*)` is `2`.

### Drop the view only

`DROP VIEW` removes the named query and leaves the base table stored.

```sql run expect="4" title="The table remains"
CREATE TABLE item (n INT);
INSERT INTO item VALUES (4);
CREATE VIEW v AS SELECT n FROM item;
DROP VIEW v;
SELECT n FROM item;
```

After the view is gone, the base table still returns `4`.
