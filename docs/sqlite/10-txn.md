---
language: sqlite
chapter: 10
title: "事务"
level: advanced
minutes: 18
goals:
  - "用 BEGIN 和 COMMIT 提交一组写入"
  - "用 ROLLBACK 撤销这一组"
  - "知道脚本结束前要明确提交"
sources:
  - sqlite-lang
  - sqlbolt
  - select-star
updated: "2026-10-15"
---

BEGIN 开始一组写入，COMMIT 让它们留下，ROLLBACK 全部撤销。账本里「加一笔记上一笔」应该在同一组里：要么都在，要么都不在。

本环境每次运行都是新库，事务只在这一份脚本里有意义。COMMIT 之后同一份脚本里的 SELECT 能看见这些行。ROLLBACK 之后 SELECT 应当看不见。不要把 COMMIT 理解成写到磁盘上、下次 Run 还在。下次仍是空库。

忘记 COMMIT 就结束，这一组可能不会留下。示例里要么 COMMIT 再查询，要么 ROLLBACK 再查询，两种结果都用数字说清楚。

```sqlite run expect="0" title="撤销"
CREATE TABLE t(n INTEGER);
BEGIN;
INSERT INTO t VALUES (1);
ROLLBACK;
SELECT COUNT(*) FROM t;
```

```sqlite run expect="1" title="提交"
CREATE TABLE t(n INTEGER);
BEGIN;
INSERT INTO t VALUES (1);
COMMIT;
SELECT COUNT(*) FROM t;
```

```sqlite run expect="3" title="两笔一起"
CREATE TABLE t(n INTEGER);
BEGIN;
INSERT INTO t VALUES (1);
INSERT INTO t VALUES (2);
COMMIT;
SELECT SUM(n) FROM t;
```

### 读「撤销」

先做这一例。把代码收成一行来记：`CREATE TABLE t(n INTEGER); BEGIN; INSERT INTO t VALUES (1); ROLLBACK; SELECT COUNT(*) FROM t;`。先盖住终端，写下你预测的输出，里面要能找到「0」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 读「提交」

做完上一例再做这一例。把代码收成一行来记：`CREATE TABLE t(n INTEGER); BEGIN; INSERT INTO t VALUES (1); COMMIT; SELECT COUNT(*) FROM t;`。先盖住终端，写下你预测的输出，里面要能找到「1」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 读「两笔一起」

做完上一例再做这一例。把代码收成一行来记：`CREATE TABLE t(n INTEGER); BEGIN; INSERT INTO t VALUES (1); INSERT INTO t VALUES (2); COMMIT; SELECT SUM(n) FROM t;`。先盖住终端，写下你预测的输出，里面要能找到「3」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 只改一处：撤销

这一例要避开的失误是：以为 COMMIT 会让下一轮 Run 还能看见这些行。。对应的做法是：一组要同时留下的写入放进 BEGIN 和 COMMIT。。

把代码收成一行来核对：`CREATE TABLE t(n INTEGER); BEGIN; INSERT INTO t VALUES (1); ROLLBACK; SELECT COUNT(*) FROM t;`。盖住终端，先写下预测，里面要能找到「0」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「0」才算失败。

### 只改一处：提交

这一例要避开的失误是：BEGIN 之后既不 COMMIT 也不 ROLLBACK，就去猜结果。。对应的做法是：演示撤销时用 ROLLBACK，紧接着 SELECT COUNT。。

把代码收成一行来核对：`CREATE TABLE t(n INTEGER); BEGIN; INSERT INTO t VALUES (1); COMMIT; SELECT COUNT(*) FROM t;`。盖住终端，先写下预测，里面要能找到「1」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「1」才算失败。

### 只改一处：两笔一起

这一例要避开的失误是：把两笔不相关的修改放进同一事务，失败时一起被撤销。。对应的做法是：记住下次运行库是空的，事务救不了跨运行的数据。。

把代码收成一行来核对：`CREATE TABLE t(n INTEGER); BEGIN; INSERT INTO t VALUES (1); INSERT INTO t VALUES (2); COMMIT; SELECT SUM(n) FROM t;`。盖住终端，先写下预测，里面要能找到「3」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「3」才算失败。

## 读完再动手

本章要留下的是 「用 BEGIN 和 COMMIT 提交一组写入」、「用 ROLLBACK 撤销这一组」、「知道脚本结束前要明确提交」。合上抽屉之前，用自己的话说出每一项目标对应哪一个示例的标题。对不上标题，就还没有把目标和代码连起来，先别展开练习答案。

练习的答案默认折着。先在编辑器里自己写，再展开对照。对照时只看输出是否包含期望的那几个字。两道都过了再进入下一章。下一次运行是新进程，这次的变量不会留下。

把这一章当成一次可以反复撤销的实验。点代码块上的 Run 会用示例覆盖编辑器，原来的草稿先备份。你改过的内容如果还想留着，先复制到别处，再点下一例。工具栏的 Run 不会从文档重写编辑器，所以它用来看你改过的版本。两种按钮各做各的事。下载进度写在按钮旁边，第一次打开这种语言时要等它结束，再判断示例是不是写错了。

记录你预测错的那一次。写下你以为会打印的文字，以及实际多出来或少掉的部分。进入下一章之前，要能用一句话说清差在哪。通过只说明期望的那几个字还在，不说明你已经看懂产生它的那一行。章节标题下的目标就是这份验收清单。差两个字也不要靠改期望凑过去。

## 常见错误

- 以为 COMMIT 会让下一轮 Run 还能看见这些行。
- BEGIN 之后既不 COMMIT 也不 ROLLBACK，就去猜结果。
- 把两笔不相关的修改放进同一事务，失败时一起被撤销。

## 最佳实践

- 一组要同时留下的写入放进 BEGIN 和 COMMIT。
- 演示撤销时用 ROLLBACK，紧接着 SELECT COUNT。
- 记住下次运行库是空的，事务救不了跨运行的数据。

## 小结

事务让一组写入同时留下或同时消失。COMMIT 只保证这一份脚本的后半能看见。下次运行仍从空库开始。

## 练习

插入 4 和 5 后回滚，选出行数。

::: answer 参考答案：撤销两笔
```sqlite run expect="0" title="参考答案"
CREATE TABLE t(n INTEGER);
BEGIN;
INSERT INTO t VALUES (4), (5);
ROLLBACK;
SELECT COUNT(*) FROM t;
```
:::

提交一行 9，选出这个数。

::: answer 参考答案：留下
```sqlite run expect="9" title="参考答案"
CREATE TABLE t(n INTEGER);
BEGIN;
INSERT INTO t VALUES (9);
COMMIT;
SELECT n FROM t;
```
:::

## 延伸阅读

- [SQLite SQL Language Reference](https://www.sqlite.org/lang.html)（公有领域，仅链接）
- [SQLBolt](https://sqlbolt.com/)（仅链接）
- [Select Star SQL](https://selectstarsql.com/)（仅链接）

## 参考与致谢

正文为原创。知识点范围参考了 SQLite 语言参考、SQLBolt 与 Select Star SQL，没有逐字搬用原文。
