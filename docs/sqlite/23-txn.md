---
language: sqlite
chapter: 23
title: "SQLite 事务"
level: beginner
minutes: 8
goals:
  - "用 BEGIN 和 COMMIT 提交"
  - "用 ROLLBACK 撤销"
  - "知道提交之后改动还在"
sources:
  - sqlite-lang
updated: "2026-10-15"
---

事务把若干改动收成一次。回滚之后，这些改动像没发生过。

### 提交

`COMMIT` 之后能查到插入的行。

```sql run expect="4" title="留下了"
CREATE TABLE item (n INT);
BEGIN;
INSERT INTO item VALUES (4);
COMMIT;
SELECT n FROM item;
```

输出里能看到 `4`。

### 回滚

`ROLLBACK` 丢掉事务里的插入。

```sql run expect="0" title="没有留下"
CREATE TABLE item (n INT);
BEGIN;
INSERT INTO item VALUES (4);
ROLLBACK;
SELECT COUNT(*) FROM item;
```

输出里能看到 `0`。

### 回滚不影响之前的提交

先提交一行，再在新事务里回滚，原来的行还在。

```sql run expect="1" title="只剩先提交的"
CREATE TABLE item (n INT);
INSERT INTO item VALUES (1);
BEGIN;
INSERT INTO item VALUES (2);
ROLLBACK;
SELECT n FROM item;
```

输出里能看到 `1`。
