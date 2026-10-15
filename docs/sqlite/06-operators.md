---
language: sqlite
chapter: 6
title: "SQLite 运算符"
level: beginner
minutes: 8
goals:
  - "使用比较运算"
  - "使用 AND 与 OR"
  - "使用 BETWEEN"
sources:
  - sqlite-lang
updated: "2026-10-15"
---

条件运算得到 0 或 1。0 是假，1 是真。

### 比较

大于成立时结果是 1。

```sql run expect="1|0" title="真和假"
SELECT 3 > 1, 3 = 1;
```

输出里能看到 `1|0`。

### 与和或

`AND` 两边都真才是 1。

```sql run expect="0|1" title="逻辑"
SELECT 1 AND 0, 1 OR 0;
```

输出里能看到 `0|1`。

### 范围

`BETWEEN` 含两端。

```sql run expect="1" title="含端点"
SELECT 3 BETWEEN 1 AND 3;
```

输出里能看到 `1`。
