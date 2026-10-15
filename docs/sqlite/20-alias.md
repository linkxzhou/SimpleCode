---
language: sqlite
chapter: 20
title: "SQLite 别名"
level: beginner
minutes: 8
goals:
  - "给列起短名"
  - "给表起短名"
  - "在 ORDER BY 里使用列别名"
sources:
  - sqlite-lang
updated: "2026-10-15"
---

别名让长表达式可以在后面被提到。

### 列别名

没有表头时别名不显示，值仍然是计算结果。

```sql run expect="5" title="和"
SELECT 2 + 3 AS total;
```

输出里能看到 `5`。

### 表别名

短名可以写在列前面。

```sql run expect="茶" title="短名"
CREATE TABLE item (name TEXT);
INSERT INTO item VALUES ('茶');
SELECT i.name FROM item AS i;
```

输出里能看到 `茶`。

### 排序用别名

SQLite 允许 `ORDER BY` 使用 SELECT 里的列别名。

```sql run expect="1" title="按别名"
CREATE TABLE item (n INT);
INSERT INTO item VALUES (2), (1);
SELECT n AS v FROM item ORDER BY v LIMIT 1;
```

输出里能看到 `1`。
