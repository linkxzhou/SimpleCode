---
language: sqlite
chapter: 24
title: "SQLite 子查询"
level: beginner
minutes: 8
goals:
  - "在 WHERE 里使用子查询"
  - "用 IN 配合子查询"
  - "在 FROM 里使用子查询"
sources:
  - sqlite-lang
updated: "2026-10-15"
---

子查询是嵌在另一句里的 `SELECT`。

### 标量

子查询返回一个数，外层拿它做比较。

```sql run expect="18" title="最大"
CREATE TABLE item (price INT);
INSERT INTO item VALUES (18), (6);
SELECT price FROM item WHERE price = (SELECT MAX(price) FROM item);
```

输出里能看到 `18`。

### IN

名字在另一张表里才留下。

```sql run expect="tea" title="要留下的"
CREATE TABLE item (name TEXT);
CREATE TABLE keep (name TEXT);
INSERT INTO item VALUES ('tea'), ('water');
INSERT INTO keep VALUES ('tea');
SELECT name FROM item WHERE name IN (SELECT name FROM keep);
```

输出里能看到 `tea`。

### FROM 里的子查询

内层先算出和，外层再读这一列。

```sql run expect="5" title="内层的和"
SELECT total FROM (SELECT 2 + 3 AS total);
```

输出里能看到 `5`。
