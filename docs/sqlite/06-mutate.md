---
language: sqlite
chapter: 6
title: "UPDATE 与 DELETE"
level: intermediate
minutes: 18
goals:
  - "按条件改列"
  - "按条件删行"
  - "改完用 SELECT 核对"
sources:
  - sqlite-lang
  - sqlbolt
  - select-star
updated: "2026-10-15"
---

UPDATE 改已经在表里的行。SET 写新值，WHERE 限制改哪些行。没有 WHERE 的 UPDATE 会改全表。写之前先用同样的 WHERE 做一次 SELECT，确认将要改的是那些行。

DELETE 删行，不删表。没有 WHERE 会清空表，表结构还在。DROP TABLE 才丢掉表。本教程的例子需要清空时用 DELETE，同一份脚本后面还能再插入。

UPDATE 和 DELETE 本身不打印受影响的行数。改完写 SELECT SUM 或 COUNT，用数字核对。不要靠终端空白判断改成功了没有。

```sqlite run expect="7" title="加一"
CREATE TABLE t(n INTEGER);
INSERT INTO t VALUES (1), (2), (3);
UPDATE t SET n = n + 1 WHERE n = 1;
SELECT SUM(n) FROM t;
```

```sqlite run expect="3" title="删小的"
CREATE TABLE t(n INTEGER);
INSERT INTO t VALUES (1), (2), (3);
DELETE FROM t WHERE n < 3;
SELECT SUM(n) FROM t;
```

```sqlite run expect="0" title="清空"
CREATE TABLE t(n INTEGER);
INSERT INTO t VALUES (1);
DELETE FROM t;
SELECT COUNT(*) FROM t;
```

### 读「加一」

先做这一例。把代码收成一行来记：`CREATE TABLE t(n INTEGER); INSERT INTO t VALUES (1), (2), (3); UPDATE t SET n = n + 1 WHERE n = 1; SELECT SUM(n) FROM t;`。先盖住终端，写下你预测的输出，里面要能找到「7」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 读「删小的」

做完上一例再做这一例。把代码收成一行来记：`CREATE TABLE t(n INTEGER); INSERT INTO t VALUES (1), (2), (3); DELETE FROM t WHERE n < 3; SELECT SUM(n) FROM t;`。先盖住终端，写下你预测的输出，里面要能找到「3」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 读「清空」

做完上一例再做这一例。把代码收成一行来记：`CREATE TABLE t(n INTEGER); INSERT INTO t VALUES (1); DELETE FROM t; SELECT COUNT(*) FROM t;`。先盖住终端，写下你预测的输出，里面要能找到「0」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 只改一处：加一

这一例要避开的失误是：UPDATE 忘了 WHERE，全表被改成同一个值。。对应的做法是：先 SELECT 再 UPDATE，WHERE 保持同一份。。

把代码收成一行来核对：`CREATE TABLE t(n INTEGER); INSERT INTO t VALUES (1), (2), (3); UPDATE t SET n = n + 1 WHERE n = 1; SELECT SUM(n) FROM t;`。盖住终端，先写下预测，里面要能找到「7」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「7」才算失败。

### 只改一处：删小的

这一例要避开的失误是：把 DELETE 当成 DROP，以为表也不见了。。对应的做法是：清空用 DELETE，拆表用 DROP，两件事分开。。

把代码收成一行来核对：`CREATE TABLE t(n INTEGER); INSERT INTO t VALUES (1), (2), (3); DELETE FROM t WHERE n < 3; SELECT SUM(n) FROM t;`。盖住终端，先写下预测，里面要能找到「3」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「3」才算失败。

### 只改一处：清空

这一例要避开的失误是：不写 SELECT，只看终端没有输出。。对应的做法是：改完用 SUM 或 COUNT 打出你要的数。。

把代码收成一行来核对：`CREATE TABLE t(n INTEGER); INSERT INTO t VALUES (1); DELETE FROM t; SELECT COUNT(*) FROM t;`。盖住终端，先写下预测，里面要能找到「0」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「0」才算失败。

## 读完再动手

本章要留下的是 「按条件改列」、「按条件删行」、「改完用 SELECT 核对」。合上抽屉之前，用自己的话说出每一项目标对应哪一个示例的标题。对不上标题，就还没有把目标和代码连起来，先别展开练习答案。

练习的答案默认折着。先在编辑器里自己写，再展开对照。对照时只看输出是否包含期望的那几个字。两道都过了再进入下一章。下一次运行是新进程，这次的变量不会留下。

把这一章当成一次可以反复撤销的实验。点代码块上的 Run 会用示例覆盖编辑器，原来的草稿先备份。你改过的内容如果还想留着，先复制到别处，再点下一例。工具栏的 Run 不会从文档重写编辑器，所以它用来看你改过的版本。两种按钮各做各的事。下载进度写在按钮旁边，第一次打开这种语言时要等它结束，再判断示例是不是写错了。

记录你预测错的那一次。写下你以为会打印的文字，以及实际多出来或少掉的部分。进入下一章之前，要能用一句话说清差在哪。通过只说明期望的那几个字还在，不说明你已经看懂产生它的那一行。章节标题下的目标就是这份验收清单。差两个字也不要靠改期望凑过去。

## 常见错误

- UPDATE 忘了 WHERE，全表被改成同一个值。
- 把 DELETE 当成 DROP，以为表也不见了。
- 不写 SELECT，只看终端没有输出。

## 最佳实践

- 先 SELECT 再 UPDATE，WHERE 保持同一份。
- 清空用 DELETE，拆表用 DROP，两件事分开。
- 改完用 SUM 或 COUNT 打出你要的数。

## 小结

UPDATE 改列，DELETE 删行。两者都不打印结果。没有 WHERE 就作用于整张表，改完一定 SELECT。

## 练习

把 id 为 1 的名字改成 Ada 并选出。

::: answer 参考答案：改名
```sqlite run expect="Ada" title="参考答案"
CREATE TABLE t(id INTEGER, name TEXT);
INSERT INTO t VALUES (1, 'x');
UPDATE t SET name = 'Ada' WHERE id = 1;
SELECT name FROM t;
```
:::

删掉等于 2 的行，选出剩下的和。

::: answer 参考答案：删一
```sqlite run expect="4" title="参考答案"
CREATE TABLE t(n INTEGER);
INSERT INTO t VALUES (1), (2), (3);
DELETE FROM t WHERE n = 2;
SELECT SUM(n) FROM t;
```
:::

## 延伸阅读

- [SQLite SQL Language Reference](https://www.sqlite.org/lang.html)（公有领域，仅链接）
- [SQLBolt](https://sqlbolt.com/)（仅链接）
- [Select Star SQL](https://selectstarsql.com/)（仅链接）

## 参考与致谢

正文为原创。知识点范围参考了 SQLite 语言参考、SQLBolt 与 Select Star SQL，没有逐字搬用原文。
