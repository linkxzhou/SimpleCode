---
language: sqlite
chapter: 25
title: "SQLite 常用函数"
level: beginner
minutes: 8
goals:
  - "使用 COUNT 和 SUM"
  - "使用 LENGTH 和 UPPER"
  - "使用 ROUND"
sources:
  - sqlite-lang
updated: "2026-10-15"
---

函数可以写在 `SELECT` 里。聚合函数对多行算出一个值。

### COUNT 和 SUM

两行的单价加起来是 24。

```sql run expect="2|24" title="行数与和"
CREATE TABLE item (price INT);
INSERT INTO item VALUES (18), (6);
SELECT COUNT(*), SUM(price) FROM item;
```

输出里能看到 `2|24`。

### 长度

`length` 对文本按字符计。两个汉字是 2。

```sql run expect="2" title="两个字"
SELECT length('你好');
```

输出里能看到 `2`。

### 四舍五入

`round` 收到指定的小数位。这里收到整数。

```sql run expect="2.0" title="收到 2"
SELECT round(1.6);
```

输出里能看到 `2.0`。
