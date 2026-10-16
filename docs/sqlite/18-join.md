---
language: sqlite
chapter: 18
title: "SQLite Join"
level: beginner
minutes: 8
goals:
  - "用 INNER JOIN 按键连接"
  - "用 LEFT JOIN 保留左表"
  - "知道没有匹配时右表是空"
sources:
  - sqlite-lang
updated: "2026-10-15"
---

连接按相同的键把两张表拼成一行。

### 内连接

两边都有这个 id 才出现。

```sql run expect="tea|2" title="对上了"
CREATE TABLE item (id INT, name TEXT);
CREATE TABLE stock (id INT, qty INT);
INSERT INTO item VALUES (1, 'tea');
INSERT INTO stock VALUES (1, 2);
SELECT item.name, stock.qty FROM item JOIN stock ON item.id = stock.id;
```

输出里能看到 `tea|2`。

### 左连接仍保留左表

右表没有匹配时，左表的名字还在。

```sql run expect="tea" title="没有库存也留下"
CREATE TABLE item (id INT, name TEXT);
CREATE TABLE stock (id INT, qty INT);
INSERT INTO item VALUES (1, 'tea');
SELECT item.name FROM item LEFT JOIN stock ON item.id = stock.id;
```

输出里能看到 `tea`。

### 右表为空

没有匹配时，右表的数量是 NULL。

```sql run expect="1" title="数量是空"
CREATE TABLE item (id INT, name TEXT);
CREATE TABLE stock (id INT, qty INT);
INSERT INTO item VALUES (1, 'tea');
SELECT stock.qty IS NULL FROM item LEFT JOIN stock ON item.id = stock.id;
```

输出里能看到 `1`。
