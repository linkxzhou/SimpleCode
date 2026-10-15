---
language: sqlite
chapter: 10
title: "SQLite Delete 语句"
level: beginner
minutes: 8
goals:
  - "删掉匹配的行"
  - "留下不匹配的行"
  - "知道没有 WHERE 会清空表"
sources:
  - sqlite-lang
updated: "2026-10-15"
---

`DELETE` 删的是行，不是某一列。列要改用 `UPDATE`。

### 按条件删除

删掉单价小于 10 的行。

```sql run expect="茶" title="只剩茶"
CREATE TABLE item (name TEXT, price INT);
INSERT INTO item VALUES ('茶', 18), ('水', 6);
DELETE FROM item WHERE price < 10;
SELECT name FROM item;
```

输出里能看到 `茶`。

### 数剩下的行

删掉一行后还剩一行。

```sql run expect="1" title="剩一行"
CREATE TABLE item (name TEXT);
INSERT INTO item VALUES ('茶'), ('水');
DELETE FROM item WHERE name = '水';
SELECT COUNT(*) FROM item;
```

输出里能看到 `1`。

### 清空

不写 `WHERE` 会删光。表还在，行数是 0。

```sql run expect="0" title="空表"
CREATE TABLE item (n INT);
INSERT INTO item VALUES (1);
DELETE FROM item;
SELECT COUNT(*) FROM item;
```

输出里能看到 `0`。
