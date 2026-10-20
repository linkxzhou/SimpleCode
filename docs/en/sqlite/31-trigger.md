---
language: sqlite
chapter: 31
title: "SQLite triggers"
level: advanced
minutes: 10
goals:
  - "Write an audit row after an insert"
  - "Record the old and new values on update"
  - "Drop a negative row with RAISE"
sources:
  - sqlite-lang
updated: "2026-10-20"
---

A trigger runs more SQL when an `INSERT` or `UPDATE` happens. `NEW` is the new row and `OLD` is the old row. `RAISE(IGNORE)` skips the current row instead of failing the whole script. The trigger and the tables live only for this run.

### Record the insert

After 6 is inserted into `item`, the trigger writes that same number into `audit`. Reading the audit table returns 6.

```sql run expect="6" title="Audit holds 6"
CREATE TABLE item (qty INT);
CREATE TABLE audit (qty INT);
CREATE TRIGGER item_audit AFTER INSERT ON item
BEGIN
  INSERT INTO audit VALUES (NEW.qty);
END;
INSERT INTO item VALUES (6);
SELECT qty FROM audit;
```

The audit row is 6.

### Before and after an update

Tea changes from 2 to 5. The `AFTER UPDATE` trigger writes the old and new quantities into `log`. The line is `2|5`.

```sql run expect="2|5" title="Old and new"
CREATE TABLE item (name TEXT PRIMARY KEY, qty INT);
CREATE TABLE log (old_qty INT, new_qty INT);
CREATE TRIGGER item_upd AFTER UPDATE ON item
BEGIN
  INSERT INTO log VALUES (OLD.qty, NEW.qty);
END;
INSERT INTO item VALUES ('tea', 2);
UPDATE item SET qty = 5 WHERE name = 'tea';
SELECT old_qty, new_qty FROM log;
```

The log line is `2|5`.

### A negative quantity stays out

`BEFORE INSERT` calls `RAISE(IGNORE)` when the new quantity is below 0, and that row is skipped. The next insert is 4. The table has 1 row.

```sql run expect="1" title="Negative row skipped"
CREATE TABLE item (qty INT);
CREATE TRIGGER nonneg BEFORE INSERT ON item
WHEN NEW.qty < 0
BEGIN
  SELECT RAISE(IGNORE);
END;
INSERT INTO item VALUES (-1);
INSERT INTO item VALUES (4);
SELECT COUNT(*) FROM item;
```

One row remains.

### Exercise: two inserts, two audit rows

The trigger runs for every insert. Inserting 1 and then 3 leaves 2 audit rows.

```sql run expect="2" title="Two audit rows"
CREATE TABLE item (qty INT);
CREATE TABLE audit (qty INT);
CREATE TRIGGER item_audit AFTER INSERT ON item
BEGIN
  INSERT INTO audit VALUES (NEW.qty);
END;
INSERT INTO item VALUES (1);
INSERT INTO item VALUES (3);
SELECT COUNT(*) FROM audit;
```

The audit table has 2 rows.
