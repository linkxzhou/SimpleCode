---
language: sqlite
chapter: 2
title: "SQLite 数据类型"
level: beginner
minutes: 8
goals:
  - "区分整数、文本和空"
  - "用 typeof 看存储类型"
  - "知道整数相除仍是整数"
sources:
  - sqlite-lang
updated: "2026-10-15"
---

SQLite 的类型更接近存储类别。同一列里也可以混放，课程里仍一列一种。

### typeof

整数的存储类是 integer，文本是 text。

```sql run expect="integer|text" title="两类"
SELECT typeof(3), typeof('茶');
```

输出里能看到 `integer|text`。

### 整除

两个整数相除，小数被丢掉。

```sql run expect="3|2" title="商和余数"
SELECT 20 / 6, 20 % 6;
```

输出里能看到 `3|2`。

### 除以零是空

1/0 不是错误，而是 NULL。`IS NULL` 把它变成 1。

```sql run expect="1" title="空"
SELECT 1 / 0 IS NULL;
```

输出里能看到 `1`。
