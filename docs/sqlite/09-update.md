---
language: sqlite
chapter: 9
title: "SQLite Update 语句"
level: beginner
minutes: 8
goals:
  - "改一行的列"
  - "用 WHERE 限制改动范围"
  - "知道没有 WHERE 会改全表"
sources:
  - sqlite-lang
updated: "2026-10-15"
---

`UPDATE` 改已经存在的行。一定写上 `WHERE`，除非你真的要改每一行。

### 改一格

把茶的单价改成 20。

```sql run expect="20" title="新单价"
CREATE TABLE item (name TEXT, price INT);
INSERT INTO item VALUES ('茶', 18);
UPDATE item SET price = 20 WHERE name = '茶';
SELECT price FROM item;
```

输出里能看到 `20`。

### 只改匹配的行

水的单价不动。

```sql run expect="6" title="水没变"
CREATE TABLE item (name TEXT, price INT);
INSERT INTO item VALUES ('茶', 18), ('水', 6);
UPDATE item SET price = 20 WHERE name = '茶';
SELECT price FROM item WHERE name = '水';
```

输出里能看到 `6`。

### 没有 WHERE 会改光

演示时先插两行，再全部改成 1，行数仍是 2。

```sql run expect="2" title="两行都改了"
CREATE TABLE item (price INT);
INSERT INTO item VALUES (18), (6);
UPDATE item SET price = 1;
SELECT SUM(price) FROM item;
```

输出里能看到 `2`。
