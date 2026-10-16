---
language: sqlite
chapter: 13
title: "SQLite Order By"
level: beginner
minutes: 8
goals:
  - "按数字升序"
  - "按数字降序"
  - "按文本排序"
sources:
  - sqlite-lang
updated: "2026-10-15"
---

`ORDER BY` 决定行的先后。`ASC` 是升序，`DESC` 是降序。

### 升序

最小的数排在第一行。

```sql run expect="1" title="先看到 1"
CREATE TABLE item (n INT);
INSERT INTO item VALUES (3), (1);
SELECT n FROM item ORDER BY n ASC;
```

输出里能看到 `1`。

### 降序

最大的数排在第一行。

```sql run expect="3" title="最大"
CREATE TABLE item (n INT);
INSERT INTO item VALUES (3), (1);
SELECT n FROM item ORDER BY n DESC LIMIT 1;
```

输出里能看到 `3`。

### 文本

默认按二进制顺序比较。这里有两行名字，用计数核对两行都在。

```sql run expect="2" title="两行都在"
CREATE TABLE item (name TEXT);
INSERT INTO item VALUES ('water'), ('tea');
SELECT COUNT(*) FROM item ORDER BY name;
```

输出里能看到 `2`。
