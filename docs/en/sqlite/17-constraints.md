---
language: sqlite
chapter: 17
title: "SQL Constraints"
level: beginner
minutes: 8
goals:
  - "Reject nulls with NOT NULL"
  - "Reject duplicate keys with PRIMARY KEY"
  - "Reject an illegal number with CHECK"
sources:
  - sqlite-lang
updated: "2026-10-16"
---

SQLite checks a constraint when a row is inserted. A violating statement fails. These scripts insert values that pass, then read back what was stored.

### A primary key

A second row that repeats the primary key is rejected. This script inserts one legal row and counts the table.

```sql run expect="1" title="One primary key"
CREATE TABLE item (id INT PRIMARY KEY, name TEXT);
INSERT INTO item VALUES (1, 'tea');
SELECT COUNT(*) FROM item;
```

The accepted row makes `COUNT(*)` equal `1`.

### Supply a value for NOT NULL

A column declared `NOT NULL` receives a concrete value in the `INSERT`.

```sql run expect="tea" title="A name is present"
CREATE TABLE item (name TEXT NOT NULL);
INSERT INTO item VALUES ('tea');
SELECT name FROM item;
```

The required name is stored as `tea`.

### CHECK accepts a legal number

`CHECK (price > 0)` requires a positive price. A positive insert can be selected again.

```sql run expect="18" title="A positive price"
CREATE TABLE item (price INT CHECK (price > 0));
INSERT INTO item VALUES (18);
SELECT price FROM item;
```

18 satisfies the check, so the selected price is `18`.
