---
language: sqlite
chapter: 7
title: "SQLite Where 子句"
level: beginner
minutes: 8
goals:
  - "按数字过滤"
  - "按文本过滤"
  - "组合两个条件"
sources:
  - sqlite-lang
updated: "2026-10-15"
---

`WHERE` 写在 `FROM` 后面，不满足的行不会出现。

### 数字条件

只留下单价大于 10 的名字。

```sql run expect="茶" title="大于十"
CREATE TABLE item (name TEXT, price INT);
INSERT INTO item VALUES ('茶', 18), ('水', 6);
SELECT name FROM item WHERE price > 10;
```

输出里能看到 `茶`。

### 文本条件

等号可以比较文本。

```sql run expect="水" title="等于水"
CREATE TABLE item (name TEXT);
INSERT INTO item VALUES ('茶'), ('水');
SELECT name FROM item WHERE name = '水';
```

输出里能看到 `水`。

### 两个条件

用 `AND` 同时限制名字和单价。

```sql run expect="18" title="又贵又是茶"
CREATE TABLE item (name TEXT, price INT);
INSERT INTO item VALUES ('茶', 18), ('茶', 6);
SELECT price FROM item WHERE name = '茶' AND price > 10;
```

输出里能看到 `18`。
