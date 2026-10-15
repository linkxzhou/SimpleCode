---
language: sqlite
chapter: 4
title: "聚合"
level: intermediate
minutes: 18
goals:
  - "用 COUNT、SUM、MIN、MAX"
  - "用 GROUP BY 分组"
  - "分清 COUNT(*) 和 COUNT(列)"
sources:
  - sqlite-lang
  - sqlbolt
  - select-star
updated: "2026-10-15"
---

聚合把多行收成一行。COUNT(*) 数行，包括 NULL。COUNT(列) 不数该列是 NULL 的行。SUM 忽略 NULL。空表的 SUM 是 NULL，不是 0。要显示 0 时用 COALESCE(SUM(n), 0)。

GROUP BY 按列的值分组，每一组产生一行聚合。SELECT 里除了聚合函数，只放分组列。ORDER BY 可以排组的结果。没有 GROUP BY 时，整张表是一组。

WHERE 在分组前过滤行。分组之后还要丢掉某些组，用 HAVING。本教程的例子能用 WHERE 就不用 HAVING，少一层。

```sqlite run expect="1|3|6" title="最小最大"
CREATE TABLE t(n INTEGER);
INSERT INTO t VALUES (3), (1), (2);
SELECT MIN(n), MAX(n), SUM(n) FROM t;
```

```sqlite run expect="a|3" title="分组"
CREATE TABLE t(name TEXT, n INTEGER);
INSERT INTO t VALUES ('a', 1), ('a', 2), ('b', 5);
SELECT name, SUM(n) FROM t GROUP BY name ORDER BY name;
```

```sqlite run expect="2|1" title="不数空"
SELECT COUNT(*), COUNT(n) FROM (SELECT 1 AS n UNION ALL SELECT NULL);
```

### 读「最小最大」

先做这一例。把代码收成一行来记：`CREATE TABLE t(n INTEGER); INSERT INTO t VALUES (3), (1), (2); SELECT MIN(n), MAX(n), SUM(n) FROM t;`。先盖住终端，写下你预测的输出，里面要能找到「1|3|6」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 读「分组」

做完上一例再做这一例。把代码收成一行来记：`CREATE TABLE t(name TEXT, n INTEGER); INSERT INTO t VALUES ('a', 1), ('a', 2), ('b', 5); SELECT name, SUM(n) FROM t GROUP BY name ORDER BY name;`。先盖住终端，写下你预测的输出，里面要能找到「a|3」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 读「不数空」

做完上一例再做这一例。把代码收成一行来记：`SELECT COUNT(*), COUNT(n) FROM (SELECT 1 AS n UNION ALL SELECT NULL);`。先盖住终端，写下你预测的输出，里面要能找到「2|1」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 只改一处：最小最大

这一例要避开的失误是：用 COUNT(列) 以为在数全部行，NULL 被悄悄丢掉。。对应的做法是：数行用 COUNT(*)，数有值的格子用 COUNT(列)。。

把代码收成一行来核对：`CREATE TABLE t(n INTEGER); INSERT INTO t VALUES (3), (1), (2); SELECT MIN(n), MAX(n), SUM(n) FROM t;`。盖住终端，先写下预测，里面要能找到「1|3|6」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「1|3|6」才算失败。

### 只改一处：分组

这一例要避开的失误是：SELECT 里放了既不分组也不聚合的列。。对应的做法是：分组后的 SELECT 只留分组列和聚合。。

把代码收成一行来核对：`CREATE TABLE t(name TEXT, n INTEGER); INSERT INTO t VALUES ('a', 1), ('a', 2), ('b', 5); SELECT name, SUM(n) FROM t GROUP BY name ORDER BY name;`。盖住终端，先写下预测，里面要能找到「a|3」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「a|3」才算失败。

### 只改一处：不数空

这一例要避开的失误是：空组的 SUM 是 NULL，直接拿去相加又得到 NULL。。对应的做法是：可能没有行时用 COALESCE 把 SUM 收成 0。。

把代码收成一行来核对：`SELECT COUNT(*), COUNT(n) FROM (SELECT 1 AS n UNION ALL SELECT NULL);`。盖住终端，先写下预测，里面要能找到「2|1」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「2|1」才算失败。

## 读完再动手

本章要留下的是 「用 COUNT、SUM、MIN、MAX」、「用 GROUP BY 分组」、「分清 COUNT(*) 和 COUNT(列)」。合上抽屉之前，用自己的话说出每一项目标对应哪一个示例的标题。对不上标题，就还没有把目标和代码连起来，先别展开练习答案。

练习的答案默认折着。先在编辑器里自己写，再展开对照。对照时只看输出是否包含期望的那几个字。两道都过了再进入下一章。下一次运行是新进程，这次的变量不会留下。

把这一章当成一次可以反复撤销的实验。点代码块上的 Run 会用示例覆盖编辑器，原来的草稿先备份。你改过的内容如果还想留着，先复制到别处，再点下一例。工具栏的 Run 不会从文档重写编辑器，所以它用来看你改过的版本。两种按钮各做各的事。下载进度写在按钮旁边，第一次打开这种语言时要等它结束，再判断示例是不是写错了。

记录你预测错的那一次。写下你以为会打印的文字，以及实际多出来或少掉的部分。进入下一章之前，要能用一句话说清差在哪。通过只说明期望的那几个字还在，不说明你已经看懂产生它的那一行。章节标题下的目标就是这份验收清单。差两个字也不要靠改期望凑过去。

## 常见错误

- 用 COUNT(列) 以为在数全部行，NULL 被悄悄丢掉。
- SELECT 里放了既不分组也不聚合的列。
- 空组的 SUM 是 NULL，直接拿去相加又得到 NULL。

## 最佳实践

- 数行用 COUNT(*)，数有值的格子用 COUNT(列)。
- 分组后的 SELECT 只留分组列和聚合。
- 可能没有行时用 COALESCE 把 SUM 收成 0。

## 小结

聚合把多行收成少数行。COUNT(*) 与 COUNT(列) 对 NULL 的态度不同。GROUP BY 决定一组是谁。

## 练习

插入 1、2、3、4，选出和。

::: answer 参考答案：总和
```sqlite run expect="10" title="参考答案"
CREATE TABLE t(n INTEGER);
INSERT INTO t VALUES (1), (2), (3), (4);
SELECT SUM(n) FROM t;
```
:::

a 有两行，选出分组后的组数。

::: answer 参考答案：两组
```sqlite run expect="2" title="参考答案"
CREATE TABLE t(name TEXT);
INSERT INTO t VALUES ('a'), ('a'), ('b');
SELECT COUNT(*) FROM (SELECT name FROM t GROUP BY name);
```
:::

## 延伸阅读

- [SQLite SQL Language Reference](https://www.sqlite.org/lang.html)（公有领域，仅链接）
- [SQLBolt](https://sqlbolt.com/)（仅链接）
- [Select Star SQL](https://selectstarsql.com/)（仅链接）

## 参考与致谢

正文为原创。知识点范围参考了 SQLite 语言参考、SQLBolt 与 Select Star SQL，没有逐字搬用原文。
