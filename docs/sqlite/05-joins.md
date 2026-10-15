---
language: sqlite
chapter: 5
title: "连接"
level: intermediate
minutes: 18
goals:
  - "用 JOIN 按键配对"
  - "用 LEFT JOIN 留下没有配对的行"
  - "避免忘记连接条件"
sources:
  - sqlite-lang
  - sqlbolt
  - select-star
updated: "2026-10-15"
---

JOIN 把两张表按条件配成一行。ON 里写键相等。忘记 ON，就会得到每一行对每一行的乘积，行数是两边相乘，数字看起来像算错过。

INNER JOIN 只留两边都配上的行。LEFT JOIN 保留左表全部行，右表没有配对时那些列是 NULL。要找「左表有、右表没有」的行，在 LEFT JOIN 之后写 WHERE 右表的键 IS NULL。

一张表也可以和自己的子查询连接。给表起短别名，SELECT 里写别名.列，避免两张表都有 id 时分不清。

```sqlite run expect="Ada|9" title="配对求和"
CREATE TABLE person(id INTEGER, name TEXT);
CREATE TABLE score(pid INTEGER, n INTEGER);
INSERT INTO person VALUES (1, 'Ada'), (2, 'Grace');
INSERT INTO score VALUES (1, 4), (1, 5);
SELECT person.name, SUM(score.n) FROM person JOIN score ON person.id = score.pid GROUP BY person.name;
```

```sqlite run expect="Grace" title="没有配对"
CREATE TABLE a(id INTEGER, name TEXT);
CREATE TABLE b(id INTEGER);
INSERT INTO a VALUES (1, 'Ada'), (2, 'Grace');
INSERT INTO b VALUES (1);
SELECT a.name FROM a LEFT JOIN b ON a.id = b.id WHERE b.id IS NULL;
```

```sqlite run expect="42" title="两数相乘"
SELECT a.n * b.n FROM (SELECT 6 AS n) AS a JOIN (SELECT 7 AS n) AS b ON 1 = 1;
```

### 读「配对求和」

先做这一例。把代码收成一行来记：`CREATE TABLE person(id INTEGER, name TEXT); CREATE TABLE score(pid INTEGER, n INTEGER); INSERT INTO person VALUES (1, 'Ada'), (2, 'Grace'); INSERT INT…`。先盖住终端，写下你预测的输出，里面要能找到「Ada|9」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 读「没有配对」

做完上一例再做这一例。把代码收成一行来记：`CREATE TABLE a(id INTEGER, name TEXT); CREATE TABLE b(id INTEGER); INSERT INTO a VALUES (1, 'Ada'), (2, 'Grace'); INSERT INTO b VALUES (1); SELECT a.n…`。先盖住终端，写下你预测的输出，里面要能找到「Grace」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 读「两数相乘」

做完上一例再做这一例。把代码收成一行来记：`SELECT a.n * b.n FROM (SELECT 6 AS n) AS a JOIN (SELECT 7 AS n) AS b ON 1 = 1;`。先盖住终端，写下你预测的输出，里面要能找到「42」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 只改一处：配对求和

这一例要避开的失误是：JOIN 不写 ON，行数变成乘积。。对应的做法是：每个 JOIN 都写 ON。。

把代码收成一行来核对：`CREATE TABLE person(id INTEGER, name TEXT); CREATE TABLE score(pid INTEGER, n INTEGER); INSERT INTO person VALUES (1, 'Ada'), (2, 'Grace'); INSERT INT…`。盖住终端，先写下预测，里面要能找到「Ada|9」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「Ada|9」才算失败。

### 只改一处：没有配对

这一例要避开的失误是：用 WHERE 右表列 = 某值，把 LEFT JOIN 又滤回内连接。。对应的做法是：找缺失配对时用 LEFT JOIN 再 IS NULL。。

把代码收成一行来核对：`CREATE TABLE a(id INTEGER, name TEXT); CREATE TABLE b(id INTEGER); INSERT INTO a VALUES (1, 'Ada'), (2, 'Grace'); INSERT INTO b VALUES (1); SELECT a.n…`。盖住终端，先写下预测，里面要能找到「Grace」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「Grace」才算失败。

### 只改一处：两数相乘

这一例要避开的失误是：两张表都有同名列，SELECT 不写表名。。对应的做法是：列名冲突时写表名或别名。。

把代码收成一行来核对：`SELECT a.n * b.n FROM (SELECT 6 AS n) AS a JOIN (SELECT 7 AS n) AS b ON 1 = 1;`。盖住终端，先写下预测，里面要能找到「42」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「42」才算失败。

## 读完再动手

本章要留下的是 「用 JOIN 按键配对」、「用 LEFT JOIN 留下没有配对的行」、「避免忘记连接条件」。合上抽屉之前，用自己的话说出每一项目标对应哪一个示例的标题。对不上标题，就还没有把目标和代码连起来，先别展开练习答案。

练习的答案默认折着。先在编辑器里自己写，再展开对照。对照时只看输出是否包含期望的那几个字。两道都过了再进入下一章。下一次运行是新进程，这次的变量不会留下。

把这一章当成一次可以反复撤销的实验。点代码块上的 Run 会用示例覆盖编辑器，原来的草稿先备份。你改过的内容如果还想留着，先复制到别处，再点下一例。工具栏的 Run 不会从文档重写编辑器，所以它用来看你改过的版本。两种按钮各做各的事。下载进度写在按钮旁边，第一次打开这种语言时要等它结束，再判断示例是不是写错了。

记录你预测错的那一次。写下你以为会打印的文字，以及实际多出来或少掉的部分。进入下一章之前，要能用一句话说清差在哪。通过只说明期望的那几个字还在，不说明你已经看懂产生它的那一行。章节标题下的目标就是这份验收清单。差两个字也不要靠改期望凑过去。

## 常见错误

- JOIN 不写 ON，行数变成乘积。
- 用 WHERE 右表列 = 某值，把 LEFT JOIN 又滤回内连接。
- 两张表都有同名列，SELECT 不写表名。

## 最佳实践

- 每个 JOIN 都写 ON。
- 找缺失配对时用 LEFT JOIN 再 IS NULL。
- 列名冲突时写表名或别名。

## 小结

JOIN 按 ON 配对。内连接丢掉配不上的行，左连接留住左表并用 NULL 表示右边缺失。

## 练习

人 1 叫 Ada，分数只记在 1 上，选出名字。

::: answer 参考答案：只留配上的
```sqlite run expect="Ada" title="参考答案"
CREATE TABLE person(id INTEGER, name TEXT);
CREATE TABLE score(pid INTEGER);
INSERT INTO person VALUES (1, 'Ada'), (2, 'Grace');
INSERT INTO score VALUES (1);
SELECT person.name FROM person JOIN score ON person.id = score.pid;
```
:::

选出 4 和 5 的乘积，用两个一行的子查询连接。

::: answer 参考答案：乘积
```sqlite run expect="20" title="参考答案"
SELECT a.n * b.n FROM (SELECT 4 AS n) AS a JOIN (SELECT 5 AS n) AS b ON 1 = 1;
```
:::

## 延伸阅读

- [SQLite SQL Language Reference](https://www.sqlite.org/lang.html)（公有领域，仅链接）
- [SQLBolt](https://sqlbolt.com/)（仅链接）
- [Select Star SQL](https://selectstarsql.com/)（仅链接）

## 参考与致谢

正文为原创。知识点范围参考了 SQLite 语言参考、SQLBolt 与 Select Star SQL，没有逐字搬用原文。
