---
language: sqlite
chapter: 23
title: "SQL Transactions"
level: beginner
minutes: 8
goals:
  - "Commit work with BEGIN and COMMIT"
  - "Undo work with ROLLBACK"
  - "Keep changes that were already committed"
sources:
  - sqlite-lang
updated: "2026-10-16"
---

A transaction gathers several changes into one unit. After `ROLLBACK`, the changes inside that unit are gone.

### Commit the insert

After `COMMIT`, the inserted row can be read.

```sql run expect="4" title="The row stays"
CREATE TABLE item (n INT);
BEGIN;
INSERT INTO item VALUES (4);
COMMIT;
SELECT n FROM item;
```

The committed value is `4`.

### Roll the insert back

`ROLLBACK` discards the insert made inside the open transaction.

```sql run expect="0" title="Nothing remains"
CREATE TABLE item (n INT);
BEGIN;
INSERT INTO item VALUES (4);
ROLLBACK;
SELECT COUNT(*) FROM item;
```

The discarded insert leaves `COUNT(*)` at `0`.

### An earlier commit survives the next rollback

The first insert is committed on its own. A later transaction inserts a second value and then rolls back.

```sql run expect="1" title="Only the first commit"
CREATE TABLE item (n INT);
INSERT INTO item VALUES (1);
BEGIN;
INSERT INTO item VALUES (2);
ROLLBACK;
SELECT n FROM item;
```

The select returns the committed `1`. The uncommitted 2 is gone.
