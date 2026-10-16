---
language: sqlite
chapter: 3
title: "SQL CREATE TABLE"
level: beginner
minutes: 8
goals:
  - "Define columns with CREATE TABLE"
  - "Insert a row and read it back"
  - "Remove a table with DROP TABLE"
sources:
  - sqlite-lang
updated: "2026-10-16"
---

Create a table before inserting into it. Tables from this run disappear when the script finishes.

### Create, then insert

Column names and declared types go inside the parentheses.

```sql run expect="18" title="Unit price"
CREATE TABLE item (name TEXT, price INT);
INSERT INTO item VALUES ('tea', 18);
SELECT price FROM item;
```

The stored price reads back as `18`.

### Read both columns

List every column you want in the `SELECT` list. The runner places a vertical bar between those cells.

```sql run expect="tea|18" title="Two columns"
CREATE TABLE item (name TEXT, price INT);
INSERT INTO item VALUES ('tea', 18);
SELECT name, price FROM item;
```

Name and price share the row `tea|18`.

### Drop the table and create it again

After `DROP TABLE`, the same name is free for a new table.

```sql run expect="4" title="Rebuild"
CREATE TABLE item (n INT);
DROP TABLE item;
CREATE TABLE item (n INT);
INSERT INTO item VALUES (4);
SELECT n FROM item;
```

The rebuilt table holds `4`.
