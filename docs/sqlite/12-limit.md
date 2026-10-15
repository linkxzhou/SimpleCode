---
language: sqlite
chapter: 12
title: "SQLite Limit 子句"
level: beginner
minutes: 8
goals:
  - "只取前几行"
  - "用 OFFSET 跳过"
  - "和 ORDER BY 一起用"
sources:
  - sqlite-lang
updated: "2026-10-15"
---

`LIMIT` 限制返回的行数。没有排序时，哪几行在前并不稳定，所以和 `ORDER BY` 一起用。

### 只要一行

排序之后再限制，结果是确定的。

```sql run expect="1" title="最小"
CREATE TABLE item (n INT);
INSERT INTO item VALUES (3), (1), (2);
SELECT n FROM item ORDER BY n LIMIT 1;
```

输出里能看到 `1`。

### 跳过

`OFFSET 1` 跳过第一行。

```sql run expect="2" title="第二小"
CREATE TABLE item (n INT);
INSERT INTO item VALUES (1), (2);
SELECT n FROM item ORDER BY n LIMIT 1 OFFSET 1;
```

输出里能看到 `2`。

### 两行

`LIMIT 2` 在排序后取两行。用求和核对。

```sql run expect="3" title="1 加 2"
CREATE TABLE item (n INT);
INSERT INTO item VALUES (1), (2), (9);
SELECT SUM(n) FROM (SELECT n FROM item ORDER BY n LIMIT 2);
```

输出里能看到 `3`。
