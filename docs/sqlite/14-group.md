---
language: sqlite
chapter: 14
title: "SQLite Group By"
level: beginner
minutes: 8
goals:
  - "按键分组计数"
  - "对每一组求和"
  - "知道分组后每组一行"
sources:
  - sqlite-lang
updated: "2026-10-15"
---

`GROUP BY` 把相同的键收成一行，再对这一组做聚合。

### 计数

tea 出现两次。

```sql run expect="2" title="茶的行数"
CREATE TABLE item (name TEXT);
INSERT INTO item VALUES ('tea'), ('tea'), ('water');
SELECT COUNT(*) FROM item WHERE name = 'tea';
```

输出里能看到 `2`。

### 分组

每个名字一行，后面是这个名字的行数。

```sql run expect="water|1" title="水只有一行"
CREATE TABLE item (name TEXT);
INSERT INTO item VALUES ('tea'), ('tea'), ('water');
SELECT name, COUNT(*) FROM item GROUP BY name ORDER BY name;
```

输出里能看到 `water|1`。

### 求和

同一名字的单价加在一起。

```sql run expect="18" title="十加八"
CREATE TABLE item (name TEXT, price INT);
INSERT INTO item VALUES ('tea', 10), ('tea', 8);
SELECT SUM(price) FROM item GROUP BY name;
```

输出里能看到 `18`。
