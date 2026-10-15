---
language: sqlite
chapter: 17
title: "SQLite 约束"
level: beginner
minutes: 8
goals:
  - "用 NOT NULL 拒绝空"
  - "用 PRIMARY KEY 拒绝重复"
  - "用 CHECK 拒绝不合法的数"
sources:
  - sqlite-lang
updated: "2026-10-15"
---

约束在插入时检查。违反时这条语句失败，课程里用能通过的数据演示它留下了什么。

### 主键

主键相同的第二行插不进去。先插一行，再数行数。

```sql run expect="1" title="一行主键"
CREATE TABLE item (id INT PRIMARY KEY, name TEXT);
INSERT INTO item VALUES (1, '茶');
SELECT COUNT(*) FROM item;
```

输出里能看到 `1`。

### 非空有值

声明了 `NOT NULL` 的列，插入时给它一个值。

```sql run expect="茶" title="有名字"
CREATE TABLE item (name TEXT NOT NULL);
INSERT INTO item VALUES ('茶');
SELECT name FROM item;
```

输出里能看到 `茶`。

### 检查

`CHECK` 要求单价为正。插入正数可以读回来。

```sql run expect="18" title="正的单价"
CREATE TABLE item (price INT CHECK (price > 0));
INSERT INTO item VALUES (18);
SELECT price FROM item;
```

输出里能看到 `18`。
