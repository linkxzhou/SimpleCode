---
language: sqlite
chapter: 26
title: "SQLite 公用表表达式"
level: intermediate
minutes: 9
goals:
  - "用 WITH 给一次查询起名字"
  - "在命名结果上再过滤"
  - "用 CASE 分出高低两档"
sources:
  - sqlite-lang
  - quick-sql
updated: "2026-10-20"
---

公用表表达式用 `WITH` 给后面的查询准备一张临时结果。它不是永久的表，脚本结束就消失。这一章先不递归。SQLite 的语言参考是公有领域，例子按练习场重写。Quick SQL Cheatsheet 是 MIT，这里也不摘句子。

### 只看茶的价格

`price` 里有茶和杯。外层查询按名字留下茶，价格是 4。

```sql run expect="4" title="茶的价格"
WITH price(name, n) AS (
  SELECT 'tea', 4
  UNION ALL
  SELECT 'cup', 2
)
SELECT n FROM price WHERE name = 'tea';
```

茶的价格是 4。

### 再数贵的

`item` 先插入三行。`priced` 只保留价格大于 3 的行，再数个数。茶 4 和壶 9 符合，杯 2 不符合，个数是 2。

```sql run expect="2" title="贵的有两行"
CREATE TABLE item (name TEXT, price INT);
INSERT INTO item VALUES ('tea', 4), ('cup', 2), ('pot', 9);
WITH priced AS (
  SELECT name FROM item WHERE price > 3
)
SELECT COUNT(*) FROM priced;
```

贵的有 2 行。

### 分成两档

价格大于等于 5 标成 `high`，否则是 `low`。杯的价格是 2，档位是 `low`。

```sql run expect="low" title="杯是低档"
CREATE TABLE item (name TEXT, price INT);
INSERT INTO item VALUES ('tea', 4), ('cup', 2);
WITH labeled AS (
  SELECT name,
         CASE WHEN price >= 5 THEN 'high' ELSE 'low' END AS band
  FROM item
)
SELECT band FROM labeled WHERE name = 'cup';
```

杯的档位是 `low`。

### 练习：两档各有几行

茶 4 是 `low`，壶 9 是 `high`，杯 2 也是 `low`。按档位分组，`low` 有 2 行。用 `ORDER BY` 把 `low` 放在稳定的位置，期望子串取 `low|2`。

《SQL必知必会》的目录可以对照，句子不搬：https://book.douban.com/subject/35167240 。

```sql run expect="low|2" title="低档两行"
CREATE TABLE item (name TEXT, price INT);
INSERT INTO item VALUES ('tea', 4), ('cup', 2), ('pot', 9);
WITH labeled AS (
  SELECT CASE WHEN price >= 5 THEN 'high' ELSE 'low' END AS band
  FROM item
)
SELECT band, COUNT(*) FROM labeled GROUP BY band ORDER BY band;
```

`low` 这一档是 2 行。
