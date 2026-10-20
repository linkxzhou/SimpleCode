---
language: sqlite
chapter: 34
title: "SQLite 借阅小库"
level: intermediate
minutes: 11
goals:
  - "查出谁借了某一本"
  - "用左连接数每个人的借阅"
  - "列出还没有被借走的书"
sources:
  - sqlite-lang
updated: "2026-10-20"
---

三张表：书、读者、借阅。借阅只存编号。每次运行都重新建表，没有上一份脚本留下的行。书名用 `atlas`、`kettle`、`orbit`。

### 谁借了 atlas

bea 的编号是 2，借阅把书 1 指给她。连接三张表之后得到 `bea|atlas`。

```sql run expect="bea|atlas" title="借出 atlas"
CREATE TABLE book (id INT PRIMARY KEY, title TEXT);
CREATE TABLE member (id INT PRIMARY KEY, name TEXT);
CREATE TABLE loan (book_id INT, member_id INT);
INSERT INTO book VALUES (1, 'atlas'), (2, 'kettle'), (3, 'orbit');
INSERT INTO member VALUES (1, 'ada'), (2, 'bea');
INSERT INTO loan VALUES (1, 2);
SELECT member.name, book.title
FROM loan
JOIN member ON member.id = loan.member_id
JOIN book ON book.id = loan.book_id;
```

借出记录是 `bea|atlas`。

### 每人几本

ada 借了 `orbit`，bea 借了两本。按读者分组计数，再按名字排序。`ada|1` 在第一行。

```sql run expect="ada|1" title="ada 借了一本"
CREATE TABLE book (id INT PRIMARY KEY, title TEXT);
CREATE TABLE member (id INT PRIMARY KEY, name TEXT);
CREATE TABLE loan (book_id INT, member_id INT);
INSERT INTO book VALUES (1, 'atlas'), (2, 'kettle'), (3, 'orbit');
INSERT INTO member VALUES (1, 'ada'), (2, 'bea');
INSERT INTO loan VALUES (1, 2), (2, 2), (3, 1);
SELECT member.name, COUNT(loan.book_id)
FROM member
LEFT JOIN loan ON loan.member_id = member.id
GROUP BY member.id, member.name
ORDER BY member.name;
```

ada 的计数是 1，行是 `ada|1`。

### 还在架上的书

这一次只有 atlas 被借走。`NOT IN` 留下 kettle 和 orbit。按标题排序，两行是 `kettle` 然后 `orbit`。

```sql run expect="kettle" title="kettle 还在"
CREATE TABLE book (id INT PRIMARY KEY, title TEXT);
CREATE TABLE loan (book_id INT);
INSERT INTO book VALUES (1, 'atlas'), (2, 'kettle'), (3, 'orbit');
INSERT INTO loan VALUES (1);
SELECT title FROM book
WHERE id NOT IN (SELECT book_id FROM loan)
ORDER BY title;
```

还在架上的包括 `kettle`。

### 练习：借阅次数的窗口

按读者分区的 `COUNT` 会写在该读者的每一行上。bea 有两行借阅，窗口计数是 2。外层 `DISTINCT` 后按名字排序，能看到 `bea|2`。

```sql run expect="bea|2" title="bea 的窗口计数"
CREATE TABLE member (id INT PRIMARY KEY, name TEXT);
CREATE TABLE loan (book_id INT, member_id INT);
INSERT INTO member VALUES (1, 'ada'), (2, 'bea');
INSERT INTO loan VALUES (1, 2), (2, 2), (3, 1);
SELECT DISTINCT member.name,
       COUNT(loan.book_id) OVER (PARTITION BY member.id) AS n
FROM member
JOIN loan ON loan.member_id = member.id
ORDER BY member.name;
```

bea 的窗口计数是 2。
