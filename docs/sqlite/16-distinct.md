---
language: sqlite
chapter: 16
title: "SQLite Distinct 关键字"
level: beginner
minutes: 8
goals:
  - "去掉重复的值"
  - "对多列一起去重"
  - "和 GROUP BY 区分开"
sources:
  - sqlite-lang
updated: "2026-10-15"
---

`DISTINCT` 让结果里的重复行只保留一份。

### 一列去重

tea 写了两次，结果里只剩一个。

```sql run expect="2" title="两个名字"
CREATE TABLE item (name TEXT);
INSERT INTO item VALUES ('tea'), ('tea'), ('water');
SELECT COUNT(*) FROM (SELECT DISTINCT name FROM item);
```

输出里能看到 `2`。

### 看到其中一个

排序后第一行是确定的。

```sql run expect="tea" title="字典序第一个"
CREATE TABLE item (name TEXT);
INSERT INTO item VALUES ('tea'), ('water'), ('tea');
SELECT name FROM (SELECT DISTINCT name FROM item) ORDER BY name LIMIT 1;
```

输出里能看到 `tea`。

### 多列

名字和单价都相同才算重复。

```sql run expect="2" title="两种组合"
CREATE TABLE item (name TEXT, price INT);
INSERT INTO item VALUES ('tea', 18), ('tea', 18), ('tea', 6);
SELECT COUNT(*) FROM (SELECT DISTINCT name, price FROM item);
```

输出里能看到 `2`。
