---
language: sqlite
chapter: 5
title: "SQLite Select 语句"
level: beginner
minutes: 8
goals:
  - "选择部分列"
  - "用 WHERE 留一行"
  - "用 AS 给列起名"
sources:
  - sqlite-lang
updated: "2026-10-15"
---

`SELECT` 决定输出哪些列、哪些行。

### 部分列

表里有两列时，可以只投影其中一列。

```sql run expect="tea" title="只要名字"
CREATE TABLE item (name TEXT, price INT);
INSERT INTO item VALUES ('tea', 18);
SELECT name FROM item;
```

输出里能看到 `tea`。

### 过滤

`WHERE` 留在结果里的行要满足条件。

```sql run expect="tea" title="贵的那行"
CREATE TABLE item (name TEXT, price INT);
INSERT INTO item VALUES ('tea', 18), ('water', 6);
SELECT name FROM item WHERE price > 10;
```

输出里能看到 `tea`。

### 别名不影响值

`AS` 给列起名。没有表头时，你看到的仍是值。

```sql run expect="18" title="别名"
SELECT 18 AS price;
```

输出里能看到 `18`。
