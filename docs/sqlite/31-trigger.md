---
language: sqlite
chapter: 31
title: "SQLite 触发器"
level: advanced
minutes: 10
goals:
  - "插入之后写一行审计"
  - "更新时记下旧值和新值"
  - "用 RAISE 丢掉负数"
sources:
  - sqlite-lang
updated: "2026-10-20"
---

触发器在 `INSERT` 或 `UPDATE` 发生时再执行一段 SQL。`NEW` 是新行，`OLD` 是旧行。`RAISE(IGNORE)` 可以跳过当前这一行，而不是让整个脚本失败。触发器和表都只活在这一次运行里。

### 插入时记一笔

`item` 插入 6 之后，触发器把同一个数写进 `audit`。查询审计表得到 6。

```sql run expect="6" title="审计里有 6"
CREATE TABLE item (qty INT);
CREATE TABLE audit (qty INT);
CREATE TRIGGER item_audit AFTER INSERT ON item
BEGIN
  INSERT INTO audit VALUES (NEW.qty);
END;
INSERT INTO item VALUES (6);
SELECT qty FROM audit;
```

审计行是 6。

### 更新前后

茶从 2 改成 5。`AFTER UPDATE` 触发器把旧值和新值写进 `log`，一行是 `2|5`。

```sql run expect="2|5" title="旧值和新值"
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

日志是 `2|5`。

### 负数不入库

`BEFORE INSERT` 在新数量小于 0 时 `RAISE(IGNORE)`，这一行被跳过。接着插入 4。表里只有 1 行。

```sql run expect="1" title="负数被跳过"
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

留下的行数是 1。

### 练习：两次插入两条审计

触发器对每一次插入都执行。先插入 1，再插入 3，审计表有 2 行。

```sql run expect="2" title="两条审计"
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

审计有 2 行。
