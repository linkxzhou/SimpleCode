---
language: sqlite
chapter: 33
title: "SQLite 拆表"
level: advanced
minutes: 10
goals:
  - "把重复的出版社从书名里拆出去"
  - "用连接把名字接回来"
  - "改一处出版社名字即可"
sources:
  - sqlite-lang
  - quick-sql
updated: "2026-10-20"
---

一张表里如果每本书都重复写出版社名字，改名时要改很多行。把出版社拆成自己的表，书只留编号。查询时再连接。这是范式里「事实只放一处」的一种小例子，不展开全部定义。

### 重复写在一行里

`flat` 里两本书都写着 `north`。数一数这个名字出现几次，得到 2。改名就要改两行，所以下一节把它拆开。

```sql run expect="2" title="名字重复两次"
CREATE TABLE flat (title TEXT, publisher TEXT);
INSERT INTO flat VALUES ('atlas', 'north'), ('kettle', 'north');
SELECT COUNT(*) FROM flat WHERE publisher = 'north';
```

`north` 出现 2 次。

### 拆成两张表

`publisher` 只有一行 `north`，编号是 1。两本书都引用这个编号。连接之后仍能看到 `atlas|north`。

```sql run expect="atlas|north" title="连接回名字"
CREATE TABLE publisher (id INT PRIMARY KEY, name TEXT);
CREATE TABLE book (id INT PRIMARY KEY, title TEXT, publisher_id INT);
INSERT INTO publisher VALUES (1, 'north');
INSERT INTO book VALUES (1, 'atlas', 1), (2, 'kettle', 1);
SELECT book.title, publisher.name
FROM book
JOIN publisher ON book.publisher_id = publisher.id
WHERE book.title = 'atlas';
```

连接结果是 `atlas|north`。

### 改一次名字

把出版社改成 `south`。两本书的查询都会看到新名字。这一题只查 `kettle`，得到 `kettle|south`。

```sql run expect="kettle|south" title="改名一处"
CREATE TABLE publisher (id INT PRIMARY KEY, name TEXT);
CREATE TABLE book (id INT PRIMARY KEY, title TEXT, publisher_id INT);
INSERT INTO publisher VALUES (1, 'north');
INSERT INTO book VALUES (1, 'atlas', 1), (2, 'kettle', 1);
UPDATE publisher SET name = 'south' WHERE id = 1;
SELECT book.title, publisher.name
FROM book
JOIN publisher ON book.publisher_id = publisher.id
WHERE book.title = 'kettle';
```

壶的出版社变成 `south`。

### 练习：没有出版社的书

`orbit` 的 `publisher_id` 是空的。左连接后出版社名字是空，`WHERE publisher.name IS NULL` 把它留下来。标题是 `orbit`。

```sql run expect="orbit" title="还没指定出版社"
CREATE TABLE publisher (id INT PRIMARY KEY, name TEXT);
CREATE TABLE book (id INT PRIMARY KEY, title TEXT, publisher_id INT);
INSERT INTO publisher VALUES (1, 'north');
INSERT INTO book VALUES (1, 'atlas', 1), (3, 'orbit', NULL);
SELECT book.title
FROM book
LEFT JOIN publisher ON book.publisher_id = publisher.id
WHERE publisher.name IS NULL;
```

还没指定出版社的是 `orbit`。
