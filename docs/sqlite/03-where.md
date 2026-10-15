---
language: sqlite
chapter: 3
title: "WHERE"
level: beginner
minutes: 18
goals:
  - "用比较和逻辑留下行"
  - "知道 0 在条件里为假"
  - "不把空字符串和 NULL 混在一起"
sources:
  - sqlite-lang
  - sqlbolt
  - select-star
updated: "2026-10-15"
---

WHERE 写在 FROM 后面，留下使条件为真的行。比较有 =、<>、>、<。AND 和 OR 把条件连起来。更具体的范围用括号，不要靠记忆优先级。

在 CASE WHEN 和 WHERE 里，0 是假，非零是真。这和 Ruby 相反。空字符串不是 NULL，<> '' 能把它滤掉，却滤不掉 NULL。NULL 的比较结果仍是 NULL，WHERE 不会留下它。

LIKE 做简单的模式，% 匹配任意一段。教学例子优先用 = 和比较，模式只在你确实要「包含某段文字」时再用。

```sqlite run expect="9" title="奇数和"
CREATE TABLE t(n INTEGER);
INSERT INTO t VALUES (1), (2), (3), (4), (5);
SELECT SUM(n) FROM t WHERE n % 2 = 1;
```

```sqlite run expect="no" title="零是假"
SELECT CASE WHEN 0 THEN 'yes' ELSE 'no' END;
```

```sqlite run expect="2" title="去掉空串"
CREATE TABLE t(name TEXT);
INSERT INTO t VALUES ('Ada'), (''), ('Grace');
SELECT COUNT(*) FROM t WHERE name <> '';
```

### 读「奇数和」

先做这一例。把代码收成一行来记：`CREATE TABLE t(n INTEGER); INSERT INTO t VALUES (1), (2), (3), (4), (5); SELECT SUM(n) FROM t WHERE n % 2 = 1;`。先盖住终端，写下你预测的输出，里面要能找到「9」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 读「零是假」

做完上一例再做这一例。把代码收成一行来记：`SELECT CASE WHEN 0 THEN 'yes' ELSE 'no' END;`。先盖住终端，写下你预测的输出，里面要能找到「no」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 读「去掉空串」

做完上一例再做这一例。把代码收成一行来记：`CREATE TABLE t(name TEXT); INSERT INTO t VALUES ('Ada'), (''), ('Grace'); SELECT COUNT(*) FROM t WHERE name <> '';`。先盖住终端，写下你预测的输出，里面要能找到「2」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 只改一处：奇数和

这一例要避开的失误是：用 WHERE name 判断名字是不是空的。0 和空结果的规则与 Ruby 不同。。对应的做法是：先用 SELECT 打出全部行，再加 WHERE，确认少掉的是你想少的。。

把代码收成一行来核对：`CREATE TABLE t(n INTEGER); INSERT INTO t VALUES (1), (2), (3), (4), (5); SELECT SUM(n) FROM t WHERE n % 2 = 1;`。盖住终端，先写下预测，里面要能找到「9」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「9」才算失败。

### 只改一处：零是假

这一例要避开的失误是：把空字符串写成 NULL，比较又对不上。。对应的做法是：空字符串用 <> ''，缺失用 IS NULL。。

把代码收成一行来核对：`SELECT CASE WHEN 0 THEN 'yes' ELSE 'no' END;`。盖住终端，先写下预测，里面要能找到「no」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「no」才算失败。

### 只改一处：去掉空串

这一例要避开的失误是：OR 和 AND 混写却不加括号。。对应的做法是：多个条件加括号。。

把代码收成一行来核对：`CREATE TABLE t(name TEXT); INSERT INTO t VALUES ('Ada'), (''), ('Grace'); SELECT COUNT(*) FROM t WHERE name <> '';`。盖住终端，先写下预测，里面要能找到「2」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「2」才算失败。

## 读完再动手

本章要留下的是 「用比较和逻辑留下行」、「知道 0 在条件里为假」、「不把空字符串和 NULL 混在一起」。合上抽屉之前，用自己的话说出每一项目标对应哪一个示例的标题。对不上标题，就还没有把目标和代码连起来，先别展开练习答案。

练习的答案默认折着。先在编辑器里自己写，再展开对照。对照时只看输出是否包含期望的那几个字。两道都过了再进入下一章。下一次运行是新进程，这次的变量不会留下。

把这一章当成一次可以反复撤销的实验。点代码块上的 Run 会用示例覆盖编辑器，原来的草稿先备份。你改过的内容如果还想留着，先复制到别处，再点下一例。工具栏的 Run 不会从文档重写编辑器，所以它用来看你改过的版本。两种按钮各做各的事。下载进度写在按钮旁边，第一次打开这种语言时要等它结束，再判断示例是不是写错了。

记录你预测错的那一次。写下你以为会打印的文字，以及实际多出来或少掉的部分。进入下一章之前，要能用一句话说清差在哪。通过只说明期望的那几个字还在，不说明你已经看懂产生它的那一行。章节标题下的目标就是这份验收清单。差两个字也不要靠改期望凑过去。

## 常见错误

- 用 WHERE name 判断名字是不是空的。0 和空结果的规则与 Ruby 不同。
- 把空字符串写成 NULL，比较又对不上。
- OR 和 AND 混写却不加括号。

## 最佳实践

- 先用 SELECT 打出全部行，再加 WHERE，确认少掉的是你想少的。
- 空字符串用 <> ''，缺失用 IS NULL。
- 多个条件加括号。

## 小结

WHERE 留下条件为真的行。0 为假。空字符串和 NULL 不是同一种缺失，比较也不同。

## 练习

从 1 到 4 里留下大于 2 的数，选出它们的和。

::: answer 参考答案：大于二
```sqlite run expect="7" title="参考答案"
CREATE TABLE t(n INTEGER);
INSERT INTO t VALUES (1), (2), (3), (4);
SELECT SUM(n) FROM t WHERE n > 2;
```
:::

选出 CASE：3 为真时打印 yes。

::: answer 参考答案：非零
```sqlite run expect="yes" title="参考答案"
SELECT CASE WHEN 3 THEN 'yes' ELSE 'no' END;
```
:::

## 延伸阅读

- [SQLite SQL Language Reference](https://www.sqlite.org/lang.html)（公有领域，仅链接）
- [SQLBolt](https://sqlbolt.com/)（仅链接）
- [Select Star SQL](https://selectstarsql.com/)（仅链接）

## 参考与致谢

正文为原创。知识点范围参考了 SQLite 语言参考、SQLBolt 与 Select Star SQL，没有逐字搬用原文。
