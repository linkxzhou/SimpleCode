---
language: sqlite
chapter: 1
title: "SQLite 语法"
level: beginner
minutes: 8
goals:
  - "用分号结束语句"
  - "知道关键字不区分大小写"
  - "用单引号包住文本"
sources:
  - sqlite-lang
updated: "2026-10-15"
---

一条语句以分号结束。文本用单引号，名字用双引号或直接写。

### 分号

两条语句按顺序执行。期望核对第二句的结果。

```sql run expect="2" title="第二条"
SELECT 1;
SELECT 2;
```

输出里能看到 `2`。

### 大小写

关键字写成小写也能执行。

```sql run expect="3" title="小写关键字"
select 3;
```

输出里能看到 `3`。

### 单引号是文本

双引号在 SQLite 里通常是标识符。文本请用单引号。

```sql run expect="water" title="文本"
SELECT 'water';
```

输出里能看到 `water`。
