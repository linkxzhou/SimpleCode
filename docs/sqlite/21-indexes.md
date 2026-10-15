---
language: sqlite
chapter: 21
title: "SQLite 索引"
level: beginner
minutes: 8
goals:
  - "用 CREATE INDEX 建索引"
  - "知道索引不改变查询结果"
  - "按索引列过滤仍得到同一行"
sources:
  - sqlite-lang
updated: "2026-10-15"
---

索引加快查找。同一份数据，有没有索引，答案应该一样。

### 建索引

索引建在已经有数据的列上。

```sql run expect="18" title="仍能查到"
CREATE TABLE item (name TEXT, price INT);
INSERT INTO item VALUES ('茶', 18);
CREATE INDEX item_name ON item(name);
SELECT price FROM item WHERE name = '茶';
```

输出里能看到 `18`。

### 结果不变

没有索引时同一句查询得到同一个数。

```sql run expect="2" title="两行"
CREATE TABLE item (name TEXT);
INSERT INTO item VALUES ('茶'), ('水');
SELECT COUNT(*) FROM item;
```

输出里能看到 `2`。

### 唯一索引

唯一索引拒绝重复的键。先插入一个不重复的值。

```sql run expect="茶" title="唯一的名字"
CREATE TABLE item (name TEXT);
CREATE UNIQUE INDEX item_name ON item(name);
INSERT INTO item VALUES ('茶');
SELECT name FROM item;
```

输出里能看到 `茶`。
