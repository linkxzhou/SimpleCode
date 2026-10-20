---
language: sqlite
chapter: 28
title: "SQLite 窗口函数"
level: advanced
minutes: 10
goals:
  - "用 ROW_NUMBER 按价格编号"
  - "用 RANK 处理并列"
  - "用 SUM 在分组内看合计"
sources:
  - sqlite-lang
updated: "2026-10-20"
---

窗口函数在不把多行折叠成一行的情况下，给每一行附加编号或合计。`OVER` 里的 `ORDER BY` 决定编号，外层还要再 `ORDER BY`，输出顺序才稳定。这份 SQLite 是 3.26，窗口函数可用。

### 按价格编号

杯的价格是 2，茶是 9。按价格升序，杯的行号是 1。外层按行号排序，第一行是 `cup|1`。

```sql run expect="cup|1" title="杯排第一"
SELECT name, ROW_NUMBER() OVER (ORDER BY price) AS rn
FROM (
  SELECT 'cup' AS name, 2 AS price
  UNION ALL
  SELECT 'tea', 9
)
ORDER BY rn;
```

第一行是 `cup|1`。

### 并列都是 1

三行的 n 是 1、3、3。按 n 排名，1 的名次是 1，两个 3 并列第 2。这一题只检查最小的那一行，文本是 `1|1`。

```sql run expect="1|1" title="最小名次"
SELECT n, RANK() OVER (ORDER BY n) AS r
FROM (
  SELECT 1 AS n
  UNION ALL
  SELECT 3
  UNION ALL
  SELECT 3
)
ORDER BY n, r;
```

第一行是 `1|1`。

### 同一名字的合计

茶有 2 和 3，窗口里的合计是 5，两行都带着 5。杯只有 1。按名字和数量排序后，能看到 `tea|5`。

```sql run expect="tea|5" title="茶的窗口合计"
SELECT name, SUM(qty) OVER (PARTITION BY name) AS total
FROM (
  SELECT 'tea' AS name, 2 AS qty
  UNION ALL
  SELECT 'tea', 3
  UNION ALL
  SELECT 'cup', 1
)
ORDER BY name, qty;
```

茶的合计是 5，出现在 `tea|5`。

### 练习：整表有几行

`COUNT(*) OVER ()` 没有分区，每一行都看到总行数。两行字面量的窗口计数都是 2。

```sql run expect="2" title="窗口里的总行数"
SELECT COUNT(*) OVER () AS n
FROM (SELECT 1 AS x UNION ALL SELECT 2);
```

窗口计数是 2。
