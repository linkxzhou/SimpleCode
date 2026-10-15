---
language: sqlite
chapter: 11
title: "账本小项目"
level: advanced
minutes: 18
goals:
  - "用一张明细表记下每一笔"
  - "按名字汇总"
  - "用事务包住互相依赖的两笔"
sources:
  - sqlite-lang
  - sqlbolt
  - select-star
updated: "2026-10-15"
---

账本只保留明细：谁、多少。总分用 SUM 现算，不另存一个容易和明细打架的余额列。同一份脚本里建表、插入、汇总。没有网络，也没有下次还在的文件。

按名字汇总用 GROUP BY。只要一个人的总分就在 WHERE 里写名字。行数用 COUNT，人数用 COUNT(DISTINCT name)。退回写成负数的一笔，不要去改历史行，这样每一笔还在。

两笔必须同时留下时放进事务。例如转入和转出。演示时可以 COMMIT 后选出两边的和，确认没有多出来的数。查询只打你要核对的那一个数字。

```sqlite run expect="3" title="一个人的总分"
CREATE TABLE lines(name TEXT, n INTEGER);
INSERT INTO lines VALUES ('Ada', 1);
INSERT INTO lines VALUES ('Ada', 2);
INSERT INTO lines VALUES ('Grace', 4);
SELECT SUM(n) FROM lines WHERE name = 'Ada';
```

```sqlite run expect="2" title="人数"
CREATE TABLE lines(name TEXT, n INTEGER);
INSERT INTO lines VALUES ('Ada', 1), ('Grace', 2);
SELECT COUNT(DISTINCT name) FROM lines;
```

```sqlite run expect="4" title="退回仍在"
CREATE TABLE lines(name TEXT, n INTEGER);
INSERT INTO lines VALUES ('Ada', 5), ('Ada', -1);
SELECT SUM(n) FROM lines;
```

### 读「一个人的总分」

先做这一例。把代码收成一行来记：`CREATE TABLE lines(name TEXT, n INTEGER); INSERT INTO lines VALUES ('Ada', 1); INSERT INTO lines VALUES ('Ada', 2); INSERT INTO lines VALUES ('Grace',…`。先盖住终端，写下你预测的输出，里面要能找到「3」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 读「人数」

做完上一例再做这一例。把代码收成一行来记：`CREATE TABLE lines(name TEXT, n INTEGER); INSERT INTO lines VALUES ('Ada', 1), ('Grace', 2); SELECT COUNT(DISTINCT name) FROM lines;`。先盖住终端，写下你预测的输出，里面要能找到「2」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 读「退回仍在」

做完上一例再做这一例。把代码收成一行来记：`CREATE TABLE lines(name TEXT, n INTEGER); INSERT INTO lines VALUES ('Ada', 5), ('Ada', -1); SELECT SUM(n) FROM lines;`。先盖住终端，写下你预测的输出，里面要能找到「4」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 只改一处：一个人的总分

这一例要避开的失误是：另存一个余额列，明细改了余额忘了改。。对应的做法是：只存明细，总分用 SUM。。

把代码收成一行来核对：`CREATE TABLE lines(name TEXT, n INTEGER); INSERT INTO lines VALUES ('Ada', 1); INSERT INTO lines VALUES ('Ada', 2); INSERT INTO lines VALUES ('Grace',…`。盖住终端，先写下预测，里面要能找到「3」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「3」才算失败。

### 只改一处：人数

这一例要避开的失误是：退回时删除原来的行，历史没了。。对应的做法是：更正用新的一笔，不改旧行。。

把代码收成一行来核对：`CREATE TABLE lines(name TEXT, n INTEGER); INSERT INTO lines VALUES ('Ada', 1), ('Grace', 2); SELECT COUNT(DISTINCT name) FROM lines;`。盖住终端，先写下预测，里面要能找到「2」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「2」才算失败。

### 只改一处：退回仍在

这一例要避开的失误是：把账本写进 ATTACH 的文件，下一次运行找不到。。对应的做法是：必须同时成功的两笔放进一个事务。。

把代码收成一行来核对：`CREATE TABLE lines(name TEXT, n INTEGER); INSERT INTO lines VALUES ('Ada', 5), ('Ada', -1); SELECT SUM(n) FROM lines;`。盖住终端，先写下预测，里面要能找到「4」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「4」才算失败。

## 读完再动手

本章要留下的是 「用一张明细表记下每一笔」、「按名字汇总」、「用事务包住互相依赖的两笔」。合上抽屉之前，用自己的话说出每一项目标对应哪一个示例的标题。对不上标题，就还没有把目标和代码连起来，先别展开练习答案。

练习的答案默认折着。先在编辑器里自己写，再展开对照。对照时只看输出是否包含期望的那几个字。两道都过了再进入下一章。下一次运行是新进程，这次的变量不会留下。

把这一章当成一次可以反复撤销的实验。点代码块上的 Run 会用示例覆盖编辑器，原来的草稿先备份。你改过的内容如果还想留着，先复制到别处，再点下一例。工具栏的 Run 不会从文档重写编辑器，所以它用来看你改过的版本。两种按钮各做各的事。下载进度写在按钮旁边，第一次打开这种语言时要等它结束，再判断示例是不是写错了。

记录你预测错的那一次。写下你以为会打印的文字，以及实际多出来或少掉的部分。进入下一章之前，要能用一句话说清差在哪。通过只说明期望的那几个字还在，不说明你已经看懂产生它的那一行。章节标题下的目标就是这份验收清单。差两个字也不要靠改期望凑过去。

## 常见错误

- 另存一个余额列，明细改了余额忘了改。
- 退回时删除原来的行，历史没了。
- 把账本写进 ATTACH 的文件，下一次运行找不到。

## 最佳实践

- 只存明细，总分用 SUM。
- 更正用新的一笔，不改旧行。
- 必须同时成功的两笔放进一个事务。

## 小结

账本是一张明细表。总分是查询，不是另一列。负数表示退回。事务只在这一次运行里保证两笔一起留下。

## 练习

插入 Ada 和 Grace 各一笔，选出不同名字的个数。

::: answer 参考答案：两条
```sqlite run expect="2" title="参考答案"
CREATE TABLE lines(name TEXT, n INTEGER);
INSERT INTO lines VALUES ('Ada', 1), ('Grace', 2);
SELECT COUNT(DISTINCT name) FROM lines;
```
:::

Ada 先记 4 再记 5，选出总分。

::: answer 参考答案：相加
```sqlite run expect="9" title="参考答案"
CREATE TABLE lines(name TEXT, n INTEGER);
INSERT INTO lines VALUES ('Ada', 4), ('Ada', 5);
SELECT SUM(n) FROM lines WHERE name = 'Ada';
```
:::

## 延伸阅读

- [SQLite SQL Language Reference](https://www.sqlite.org/lang.html)（公有领域，仅链接）
- [SQLBolt](https://sqlbolt.com/)（仅链接）
- [Select Star SQL](https://selectstarsql.com/)（仅链接）

## 参考与致谢

正文为原创。知识点范围参考了 SQLite 语言参考、SQLBolt 与 Select Star SQL，没有逐字搬用原文。
