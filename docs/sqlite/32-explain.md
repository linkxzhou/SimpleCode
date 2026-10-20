---
language: sqlite
chapter: 32
title: "SQLite 查询计划"
level: advanced
minutes: 9
goals:
  - "看出没有索引时的整表扫描"
  - "看出按索引查找"
  - "确认索引不改变答案"
sources:
  - sqlite-lang
updated: "2026-10-20"
---

`EXPLAIN QUERY PLAN` 打印查找步骤，不打印结果行。文本里会出现 `SCAN` 或 `INDEX`。不同版本的措辞可能多一个词，所以期望只取这些稳定的片段。计划不是成绩，同一条 `SELECT` 的答案仍要另外查。

### 没有索引就扫描

`item` 上没有索引。按名字过滤的计划里有 `SCAN`。

```sql run expect="SCAN" title="整表扫描"
CREATE TABLE item (name TEXT, price INT);
INSERT INTO item VALUES ('tea', 4);
EXPLAIN QUERY PLAN SELECT price FROM item WHERE name = 'tea';
```

计划里有 `SCAN`。

### 索引上查找

给 `name` 建索引之后，同一条过滤的计划里有 `INDEX`。这一份 3.26 的输出还会提到 `SEARCH`。期望只检查 `INDEX`。

```sql run expect="INDEX" title="走索引"
CREATE TABLE item (name TEXT, price INT);
INSERT INTO item VALUES ('tea', 4);
CREATE INDEX item_name ON item(name);
EXPLAIN QUERY PLAN SELECT price FROM item WHERE name = 'tea';
```

计划里有 `INDEX`。

### 答案不变

有索引时价格仍是 4。索引改变的是查找步骤，不是这一行的值。

```sql run expect="4" title="价格仍是 4"
CREATE TABLE item (name TEXT, price INT);
INSERT INTO item VALUES ('tea', 4);
CREATE INDEX item_name ON item(name);
SELECT price FROM item WHERE name = 'tea';
```

价格是 4。

### 练习：主键也是索引

`id` 是主键。按主键等值查找的计划同样含有 `INDEX`。不必再 `CREATE INDEX`。

```sql run expect="INDEX" title="主键查找"
CREATE TABLE item (id INT PRIMARY KEY, price INT);
INSERT INTO item VALUES (1, 4);
EXPLAIN QUERY PLAN SELECT price FROM item WHERE id = 1;
```

主键查找的计划里有 `INDEX`。
