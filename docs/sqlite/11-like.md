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

'tea%' 匹配以 tea 开头的文本。

```sql run expect="1" title="只有茶"
CREATE TABLE item (name TEXT);
INSERT INTO item VALUES ('tea'), ('redtea');
SELECT COUNT(*) FROM item WHERE name LIKE 'tea%';
```

输出里能看到 `1`。

### 包含

'%tea%' 匹配名字里任意位置的 tea。

```sql run expect="redtea" title="含茶"
CREATE TABLE item (name TEXT);
INSERT INTO item VALUES ('redtea'), ('water');
SELECT name FROM item WHERE name LIKE '%tea%';
```

输出里能看到 `redtea`。

### 一个字符

`_` 只占一个字符的位置。

```sql run expect="1" title="两个字符"
SELECT 'ab' LIKE 'a_';
```

输出里能看到 `1`。
