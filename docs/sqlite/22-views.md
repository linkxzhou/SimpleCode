---
language: sqlite
chapter: 22
title: "SQLite 视图"
level: beginner
minutes: 8
goals:
  - "用 CREATE VIEW 保存查询"
  - "像表一样查询视图"
  - "知道视图不另存一份数据"
sources:
  - sqlite-lang
updated: "2026-10-15"
---

视图是一个有名字的 `SELECT`。基表变了，再查视图也会变。

### 创建

视图选出单价大于 10 的名字。

```sql run expect="tea" title="贵的视图"
CREATE TABLE item (name TEXT, price INT);
INSERT INTO item VALUES ('tea', 18), ('water', 6);
CREATE VIEW dear AS SELECT name FROM item WHERE price > 10;
SELECT name FROM dear;
```

输出里能看到 `tea`。

### 基表增加一行

再插入一行贵的，视图里能看见。

```sql run expect="2" title="两行"
CREATE TABLE item (name TEXT, price INT);
INSERT INTO item VALUES ('tea', 18);
CREATE VIEW dear AS SELECT name FROM item WHERE price > 10;
INSERT INTO item VALUES ('pot', 30);
SELECT COUNT(*) FROM dear;
```

输出里能看到 `2`。

### 删掉视图

`DROP VIEW` 不删基表。

```sql run expect="4" title="表还在"
CREATE TABLE item (n INT);
INSERT INTO item VALUES (4);
CREATE VIEW v AS SELECT n FROM item;
DROP VIEW v;
SELECT n FROM item;
```

输出里能看到 `4`。
