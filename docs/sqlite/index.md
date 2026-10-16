---
language: sqlite
chapter: 0
title: "SQLite 教程"
minutes: 8
goals:
  - "用 SELECT 打出结果"
  - "知道每次运行都是一张空的内存库"
  - "不依赖点命令的表头"
sources:
  - sqlite-lang
updated: "2026-10-15"
---

这一本在内存里的 SQLite 上运行。脚本结束，库就消失。结果用竖线隔开各列。

### 没有表也能查询

字面量可以直接投影出来。

```sql run expect="tea|18" title="一行字面量"
SELECT 'tea', 18;
```

输出里能看到 `tea|18`。

### 每次都是新库

上一份脚本建的表，下一份脚本看不见。

```sql run expect="1" title="只有这一次"
SELECT 1;
```

输出里能看到 `1`。

### 点命令不是 SQL

`.headers` 和 `.tables` 是 sqlite3 外壳的命令。课程按钮只执行 SQL。

```sql norun title="外壳命令"
.headers on
.tables
```
