---
language: sqlite
chapter: 3
title: "SQLite 创建表"
level: beginner
minutes: 8
goals:
  - "用 CREATE TABLE 定义列"
  - "插入一行再查出来"
  - "用 DROP TABLE 删表"
sources:
  - sqlite-lang
updated: "2026-10-15"
---

表要先建再插。这一次运行结束，表也不再留下。

### 建表并插入

列名和类型写在括号里。

```sql run expect="18" title="单价"
CREATE TABLE item (name TEXT, price INT);
INSERT INTO item VALUES ('tea', 18);
SELECT price FROM item;
```

输出里能看到 `18`。

### 多列一起读

SELECT 列出的列用竖线隔开。

```sql run expect="tea|18" title="两列"
CREATE TABLE item (name TEXT, price INT);
INSERT INTO item VALUES ('tea', 18);
SELECT name, price FROM item;
```

输出里能看到 `tea|18`。

### 删掉再查

`DROP TABLE` 之后，同名表可以再建。

```sql run expect="4" title="重建"
CREATE TABLE item (n INT);
DROP TABLE item;
CREATE TABLE item (n INT);
INSERT INTO item VALUES (4);
SELECT n FROM item;
```

输出里能看到 `4`。
