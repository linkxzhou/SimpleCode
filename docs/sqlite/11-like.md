---
language: sqlite
chapter: 11
title: "SQLite Like 子句"
level: beginner
minutes: 8
goals:
  - "用百分号匹配一段"
  - "用下划线匹配一个字"
  - "区分大小写的默认行为"
sources:
  - sqlite-lang
updated: "2026-10-15"
---

`LIKE` 做简单的模式匹配。`%` 是任意长度，`_` 是一个字符。

### 前缀

'茶%' 匹配以茶开头的文本。

```sql run expect="1" title="只有茶"
CREATE TABLE item (name TEXT);
INSERT INTO item VALUES ('茶'), ('红茶');
SELECT COUNT(*) FROM item WHERE name LIKE '茶%';
```

输出里能看到 `1`。

### 包含

'%茶%' 匹配中间也有茶的名字。

```sql run expect="红茶" title="含茶"
CREATE TABLE item (name TEXT);
INSERT INTO item VALUES ('红茶'), ('水');
SELECT name FROM item WHERE name LIKE '%茶%';
```

输出里能看到 `红茶`。

### 一个字符

`_` 只占一个字符的位置。

```sql run expect="1" title="两个字符"
SELECT 'ab' LIKE 'a_';
```

输出里能看到 `1`。
