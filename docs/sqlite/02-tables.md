---
language: sqlite
chapter: 2
title: "建表与 INSERT"
level: beginner
minutes: 18
goals:
  - "建出带列的表"
  - "插入一行和多行"
  - "用 SELECT 读回刚插入的值"
sources:
  - sqlite-lang
  - sqlbolt
  - select-star
updated: "2026-10-15"
---

CREATE TABLE 给出表名和列。列可以写类型提示，SQLite 仍按值保存，类型提示是给人和约束看的。同一份脚本里先建表再插入，因为库是空的。

INSERT INTO 表名 VALUES 按列的顺序给值。一次可以写多行，用逗号隔开。指定列名时，没写到的列是 NULL，除非建表时给了默认或非空约束。

插入成功时终端通常是空的。紧接着写 SELECT，才能看见行。SELECT * 会把每一列打出来，列与列之间是竖线。列多的时候改成只选你要核对的那一列，期望更稳。

```sqlite run expect="2" title="两行"
CREATE TABLE t(n INTEGER);
INSERT INTO t VALUES (1), (2);
SELECT COUNT(*) FROM t;
```

```sqlite run expect="Ada" title="指定列"
CREATE TABLE t(id INTEGER, name TEXT);
INSERT INTO t(id, name) VALUES (1, 'Ada');
SELECT name FROM t;
```

```sqlite run expect="3" title="求和"
CREATE TABLE scores(name TEXT, n INTEGER);
INSERT INTO scores VALUES ('Ada', 1);
INSERT INTO scores VALUES ('Ada', 2);
SELECT SUM(n) FROM scores;
```

### 读「两行」

先做这一例。把代码收成一行来记：`CREATE TABLE t(n INTEGER); INSERT INTO t VALUES (1), (2); SELECT COUNT(*) FROM t;`。先盖住终端，写下你预测的输出，里面要能找到「2」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 读「指定列」

做完上一例再做这一例。把代码收成一行来记：`CREATE TABLE t(id INTEGER, name TEXT); INSERT INTO t(id, name) VALUES (1, 'Ada'); SELECT name FROM t;`。先盖住终端，写下你预测的输出，里面要能找到「Ada」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 读「求和」

做完上一例再做这一例。把代码收成一行来记：`CREATE TABLE scores(name TEXT, n INTEGER); INSERT INTO scores VALUES ('Ada', 1); INSERT INTO scores VALUES ('Ada', 2); SELECT SUM(n) FROM scores;`。先盖住终端，写下你预测的输出，里面要能找到「3」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 只改一处：两行

这一例要避开的失误是：只插入不查询，把空白终端当成失败。。对应的做法是：建表、插入、查询写在同一份脚本里。。

把代码收成一行来核对：`CREATE TABLE t(n INTEGER); INSERT INTO t VALUES (1), (2); SELECT COUNT(*) FROM t;`。盖住终端，先写下预测，里面要能找到「2」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「2」才算失败。

### 只改一处：指定列

这一例要避开的失误是：VALUES 的个数和列对不上。。对应的做法是：列多时只 SELECT 要核对的列。。

把代码收成一行来核对：`CREATE TABLE t(id INTEGER, name TEXT); INSERT INTO t(id, name) VALUES (1, 'Ada'); SELECT name FROM t;`。盖住终端，先写下预测，里面要能找到「Ada」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「Ada」才算失败。

### 只改一处：求和

这一例要避开的失误是：依赖上一份脚本里已经建好的表。。对应的做法是：一次插入多行时，每一行的值个数相同。。

把代码收成一行来核对：`CREATE TABLE scores(name TEXT, n INTEGER); INSERT INTO scores VALUES ('Ada', 1); INSERT INTO scores VALUES ('Ada', 2); SELECT SUM(n) FROM scores;`。盖住终端，先写下预测，里面要能找到「3」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「3」才算失败。

## 读完再动手

本章要留下的是 「建出带列的表」、「插入一行和多行」、「用 SELECT 读回刚插入的值」。合上抽屉之前，用自己的话说出每一项目标对应哪一个示例的标题。对不上标题，就还没有把目标和代码连起来，先别展开练习答案。

练习的答案默认折着。先在编辑器里自己写，再展开对照。对照时只看输出是否包含期望的那几个字。两道都过了再进入下一章。下一次运行是新进程，这次的变量不会留下。

把这一章当成一次可以反复撤销的实验。点代码块上的 Run 会用示例覆盖编辑器，原来的草稿先备份。你改过的内容如果还想留着，先复制到别处，再点下一例。工具栏的 Run 不会从文档重写编辑器，所以它用来看你改过的版本。两种按钮各做各的事。下载进度写在按钮旁边，第一次打开这种语言时要等它结束，再判断示例是不是写错了。

记录你预测错的那一次。写下你以为会打印的文字，以及实际多出来或少掉的部分。进入下一章之前，要能用一句话说清差在哪。通过只说明期望的那几个字还在，不说明你已经看懂产生它的那一行。章节标题下的目标就是这份验收清单。差两个字也不要靠改期望凑过去。

## 常见错误

- 只插入不查询，把空白终端当成失败。
- VALUES 的个数和列对不上。
- 依赖上一份脚本里已经建好的表。

## 最佳实践

- 建表、插入、查询写在同一份脚本里。
- 列多时只 SELECT 要核对的列。
- 一次插入多行时，每一行的值个数相同。

## 小结

表在本次运行里创建。INSERT 不打印，SELECT 才打印。列按顺序或按名字对应。

## 练习

建表插入 1、2、3，选出行数。

::: answer 参考答案：三行
```sqlite run expect="3" title="参考答案"
CREATE TABLE t(n INTEGER);
INSERT INTO t VALUES (1), (2), (3);
SELECT COUNT(*) FROM t;
```
:::

建表插入 Ada，选出这个名字。

::: answer 参考答案：名字
```sqlite run expect="Ada" title="参考答案"
CREATE TABLE t(name TEXT);
INSERT INTO t VALUES ('Ada');
SELECT name FROM t;
```
:::

## 延伸阅读

- [SQLite SQL Language Reference](https://www.sqlite.org/lang.html)（公有领域，仅链接）
- [SQLBolt](https://sqlbolt.com/)（仅链接）
- [Select Star SQL](https://selectstarsql.com/)（仅链接）

## 参考与致谢

正文为原创。知识点范围参考了 SQLite 语言参考、SQLBolt 与 Select Star SQL，没有逐字搬用原文。
