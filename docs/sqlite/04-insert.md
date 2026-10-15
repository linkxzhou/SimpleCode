---
language: sqlite
chapter: 4
title: "SQLite Insert 语句"
level: beginner
minutes: 8
goals:
  - "插入指定列"
  - "一次插入多行"
  - "省略的列取空"
sources:
  - sqlite-lang
updated: "2026-10-15"
---

`INSERT` 把行放进已经存在的表。

### 指定列名

列的顺序跟 `VALUES` 对应。

```sql run expect="水" title="换了顺序"
CREATE TABLE item (name TEXT, price INT);
INSERT INTO item (price, name) VALUES (6, '水');
SELECT name FROM item;
```

输出里能看到 `水`。

### 多行

多组括号一次插入两行。`COUNT` 数行数。

```sql run expect="2" title="两行"
CREATE TABLE item (name TEXT);
INSERT INTO item VALUES ('茶'), ('水');
SELECT COUNT(*) FROM item;
```

输出里能看到 `2`。

### 缺省是空

没写的列是 NULL。`IS NULL` 得到 1。

```sql run expect="1" title="没有单价"
CREATE TABLE item (name TEXT, price INT);
INSERT INTO item (name) VALUES ('茶');
SELECT price IS NULL FROM item;
```

输出里能看到 `1`。
