---
language: sqlite
chapter: 30
title: "SQLite 里的 JSON 文本"
level: advanced
minutes: 9
goals:
  - "知道这份构建没有 JSON1"
  - "把字段拆成普通列"
  - "只用 instr 看一个固定片段"
sources:
  - sqlite-lang
updated: "2026-10-20"
---

SQLite 的 JSON 函数来自编译时可选的 JSON1。这份 wasm 是 3.26，没有 `json` 和 `json_extract`，调用会报错。能稳定运行的做法是把数据拆成列。字符串函数只能演示一个写死的片段，不能当作解析器。

### 标准函数只阅读

`json_extract` 在完整的 SQLite 里能取出 `$.qty`。这里的按钮不运行它。官方说明在 https://www.sqlite.org/json1.html 。

```sql norun title="没有 json_extract"
SELECT json_extract('{"sku":"tea","qty":2}', '$.qty');
```

这一段保持阅读，避免整份脚本因「没有这个函数」失败。

### 拆成列

同一份信息写成 `sku` 和 `qty` 两列。查询数量得到 2，不需要解析花括号。

```sql run expect="2" title="列里的数量"
CREATE TABLE item (sku TEXT, qty INT);
INSERT INTO item VALUES ('tea', 2);
SELECT qty FROM item WHERE sku = 'tea';
```

数量是 2。

### 固定片段里的 tea

文档字符串是 `{"sku":"tea"}`。`instr` 找到 `tea` 的位置，`substr` 取出三个字符。键名一变，这个写法就错，所以只适合这一条字面量。

```sql run expect="tea" title="截出 tea"
SELECT substr(doc, instr(doc, 'tea'), 3)
FROM (SELECT '{"sku":"tea"}' AS doc);
```

截出来是 `tea`。

### 练习：冒号后面的数字

另一份文本写成 `tea:4`，没有花括号。冒号后面的一个字符是 `4`。这仍然是切字符串，不是 JSON。

```sql run expect="4" title="冒号后"
SELECT substr(doc, instr(doc, ':') + 1, 1)
FROM (SELECT 'tea:4' AS doc);
```

冒号后面是 `4`。
