---
language: sqlite
chapter: 9
title: "排序与限制"
level: advanced
minutes: 18
goals:
  - "用 ORDER BY 固定顺序"
  - "用 LIMIT 只要前几行"
  - "用 OFFSET 跳过开头"
sources:
  - sqlite-lang
  - sqlbolt
  - select-star
updated: "2026-10-15"
---

没有 ORDER BY 时，行的顺序不保证。刚插入的顺序常常还在，但不能写成期望里的依据。要核对「第一行是谁」，必须 ORDER BY。

LIMIT 在排序之后留下前几行。OFFSET 先跳过若干行再留下。OFFSET 很大时，数据库仍要先排完再丢，教学数据很小，可以这样写。页码从 0 开始跳：第一页 OFFSET 0。

NULL 在排序里的位置容易看错。本教程的排序列都放上非空的数或文本。文本按二进制顺序，大写和小写、英文和中文不要混在同一道要精确顺序的题里。

```sqlite run expect="1" title="最小的两个"
CREATE TABLE t(n INTEGER);
INSERT INTO t VALUES (3), (1), (2);
SELECT n FROM t ORDER BY n LIMIT 2;
```

```sqlite run expect="a" title="字母序第一"
CREATE TABLE t(name TEXT);
INSERT INTO t VALUES ('b'), ('a'), ('c');
SELECT name FROM t ORDER BY name LIMIT 1;
```

```sqlite run expect="3" title="跳过最大"
CREATE TABLE t(n INTEGER);
INSERT INTO t VALUES (1), (2), (3), (4);
SELECT n FROM t ORDER BY n DESC LIMIT 1 OFFSET 1;
```

### 读「最小的两个」

先做这一例。把代码收成一行来记：`CREATE TABLE t(n INTEGER); INSERT INTO t VALUES (3), (1), (2); SELECT n FROM t ORDER BY n LIMIT 2;`。先盖住终端，写下你预测的输出，里面要能找到「1」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 读「字母序第一」

做完上一例再做这一例。把代码收成一行来记：`CREATE TABLE t(name TEXT); INSERT INTO t VALUES ('b'), ('a'), ('c'); SELECT name FROM t ORDER BY name LIMIT 1;`。先盖住终端，写下你预测的输出，里面要能找到「a」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 读「跳过最大」

做完上一例再做这一例。把代码收成一行来记：`CREATE TABLE t(n INTEGER); INSERT INTO t VALUES (1), (2), (3), (4); SELECT n FROM t ORDER BY n DESC LIMIT 1 OFFSET 1;`。先盖住终端，写下你预测的输出，里面要能找到「3」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 只改一处：最小的两个

这一例要避开的失误是：不写 ORDER BY，却期望第一行永远是刚插入的那行。。对应的做法是：要稳定的第一行就写 ORDER BY 和 LIMIT。。

把代码收成一行来核对：`CREATE TABLE t(n INTEGER); INSERT INTO t VALUES (3), (1), (2); SELECT n FROM t ORDER BY n LIMIT 2;`。盖住终端，先写下预测，里面要能找到「1」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「1」才算失败。

### 只改一处：字母序第一

这一例要避开的失误是：LIMIT 写在 ORDER BY 前面，语法失败。。对应的做法是：顺序是 ORDER BY、LIMIT、OFFSET。。

把代码收成一行来核对：`CREATE TABLE t(name TEXT); INSERT INTO t VALUES ('b'), ('a'), ('c'); SELECT name FROM t ORDER BY name LIMIT 1;`。盖住终端，先写下预测，里面要能找到「a」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「a」才算失败。

### 只改一处：跳过最大

这一例要避开的失误是：把 OFFSET 理解成留下的行数。。对应的做法是：排序列避免 NULL。。

把代码收成一行来核对：`CREATE TABLE t(n INTEGER); INSERT INTO t VALUES (1), (2), (3), (4); SELECT n FROM t ORDER BY n DESC LIMIT 1 OFFSET 1;`。盖住终端，先写下预测，里面要能找到「3」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「3」才算失败。

## 读完再动手

本章要留下的是 「用 ORDER BY 固定顺序」、「用 LIMIT 只要前几行」、「用 OFFSET 跳过开头」。合上抽屉之前，用自己的话说出每一项目标对应哪一个示例的标题。对不上标题，就还没有把目标和代码连起来，先别展开练习答案。

练习的答案默认折着。先在编辑器里自己写，再展开对照。对照时只看输出是否包含期望的那几个字。两道都过了再进入下一章。下一次运行是新进程，这次的变量不会留下。

把这一章当成一次可以反复撤销的实验。点代码块上的 Run 会用示例覆盖编辑器，原来的草稿先备份。你改过的内容如果还想留着，先复制到别处，再点下一例。工具栏的 Run 不会从文档重写编辑器，所以它用来看你改过的版本。两种按钮各做各的事。下载进度写在按钮旁边，第一次打开这种语言时要等它结束，再判断示例是不是写错了。

记录你预测错的那一次。写下你以为会打印的文字，以及实际多出来或少掉的部分。进入下一章之前，要能用一句话说清差在哪。通过只说明期望的那几个字还在，不说明你已经看懂产生它的那一行。章节标题下的目标就是这份验收清单。差两个字也不要靠改期望凑过去。

## 常见错误

- 不写 ORDER BY，却期望第一行永远是刚插入的那行。
- LIMIT 写在 ORDER BY 前面，语法失败。
- 把 OFFSET 理解成留下的行数。

## 最佳实践

- 要稳定的第一行就写 ORDER BY 和 LIMIT。
- 顺序是 ORDER BY、LIMIT、OFFSET。
- 排序列避免 NULL。

## 小结

顺序只在 ORDER BY 之后才算数。LIMIT 留下前几行，OFFSET 先跳过。没有排序的「第一行」不能当结果。

## 练习

从 3、1、2 里选出最小的数。

::: answer 参考答案：最小
```sqlite run expect="1" title="参考答案"
CREATE TABLE t(n INTEGER);
INSERT INTO t VALUES (3), (1), (2);
SELECT n FROM t ORDER BY n LIMIT 1;
```
:::

选出第二小的数。数据是 4、1、3。

::: answer 参考答案：第二小
```sqlite run expect="3" title="参考答案"
CREATE TABLE t(n INTEGER);
INSERT INTO t VALUES (4), (1), (3);
SELECT n FROM t ORDER BY n LIMIT 1 OFFSET 1;
```
:::

## 延伸阅读

- [SQLite SQL Language Reference](https://www.sqlite.org/lang.html)（公有领域，仅链接）
- [SQLBolt](https://sqlbolt.com/)（仅链接）
- [Select Star SQL](https://selectstarsql.com/)（仅链接）

## 参考与致谢

正文为原创。知识点范围参考了 SQLite 语言参考、SQLBolt 与 Select Star SQL，没有逐字搬用原文。
