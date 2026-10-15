---
language: sqlite
chapter: 19
title: "SQLite NULL 值"
level: beginner
minutes: 8
goals:
  - "用 IS NULL 判断空"
  - "知道空和任何值比较都不是真"
  - "用 COALESCE 换成默认"
sources:
  - sqlite-lang
updated: "2026-10-15"
---

NULL 表示没有值。它和 0、空串都不同。

### 判断空

`= NULL` 不会得到真。要用 `IS NULL`。

```sql run expect="1|" title="只有 IS"
SELECT NULL IS NULL, NULL = NULL;
```

输出里能看到 `1|`。

### 比较不是真

NULL 大于 0 的结果仍是空，不是 0 或 1。`typeof` 能看见。

```sql run expect="null" title="比较结果是空"
SELECT typeof(NULL > 0);
```

输出里能看到 `null`。

### COALESCE

第一个非空的值会被留下。

```sql run expect="18" title="默认单价"
SELECT COALESCE(NULL, 18);
```

输出里能看到 `18`。
