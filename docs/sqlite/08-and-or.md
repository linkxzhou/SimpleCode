---
language: sqlite
chapter: 8
title: "SQLite AND 与 OR"
level: beginner
minutes: 8
goals:
  - "用 AND 收窄"
  - "用 OR 放宽"
  - "用括号决定先后"
sources:
  - sqlite-lang
updated: "2026-10-15"
---

`AND` 的优先级高于 `OR`。想先或后与，就加括号。

### AND 收窄

两个条件都要成立。

```sql run expect="1" title="都真"
SELECT 1 AND 1;
```

输出里能看到 `1`。

### OR 放宽

有一个成立即可。

```sql run expect="2" title="两样"
CREATE TABLE item (name TEXT);
INSERT INTO item VALUES ('茶'), ('水'), ('杯');
SELECT COUNT(*) FROM item WHERE name = '茶' OR name = '水';
```

输出里能看到 `2`。

### 括号

没有括号时，`AND` 先结合。下面用括号让 `OR` 先算。

```sql run expect="1" title="先或"
SELECT (0 OR 1) AND 1;
```

输出里能看到 `1`。
