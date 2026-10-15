---
language: sqlite
chapter: 15
title: "SQLite Having 子句"
level: beginner
minutes: 8
goals:
  - "用 HAVING 过滤分组"
  - "区分 WHERE 和 HAVING"
  - "只留下合计超过门槛的组"
sources:
  - sqlite-lang
updated: "2026-10-15"
---

`WHERE` 过滤分组前的行。`HAVING` 过滤分组之后的结果。

### 分组后再筛

只留下出现次数大于 1 的名字。

```sql run expect="茶" title="重复的名字"
CREATE TABLE item (name TEXT);
INSERT INTO item VALUES ('茶'), ('茶'), ('水');
SELECT name FROM item GROUP BY name HAVING COUNT(*) > 1;
```

输出里能看到 `茶`。

### WHERE 先去掉行

先丢掉水，再按名字计数。

```sql run expect="1" title="先过滤"
CREATE TABLE item (name TEXT);
INSERT INTO item VALUES ('茶'), ('水');
SELECT COUNT(*) FROM item WHERE name <> '水';
```

输出里能看到 `1`。

### 合计门槛

一组的单价和不超过 10 时不出现。

```sql run expect="茶" title="合计超过十"
CREATE TABLE item (name TEXT, price INT);
INSERT INTO item VALUES ('茶', 8), ('茶', 8), ('水', 3);
SELECT name FROM item GROUP BY name HAVING SUM(price) > 10;
```

输出里能看到 `茶`。
