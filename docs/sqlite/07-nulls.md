---
language: sqlite
chapter: 7
title: "NULL 与约束"
level: intermediate
minutes: 18
goals:
  - "用 IS NULL 判断缺失"
  - "用主键挡住重复"
  - "用 NOT NULL 挡住空值"
sources:
  - sqlite-lang
  - sqlbolt
  - select-star
updated: "2026-10-15"
---

NULL 表示没有值。= NULL 的结果不是真，也不是假，而是 NULL。要判断缺失，写 IS NULL 或 IS NOT NULL。COALESCE(值, 替补) 在值是 NULL 时改用替补。

PRIMARY KEY 让这一列不能重复。再插入同一个键会失败，整句停住，后面的 SELECT 也可能跑不到。若重复是可以忽略的情况，用 INSERT OR IGNORE，冲突的那一行被丢掉，脚本继续。

NOT NULL 拒绝这一列没有值。和主键一样，违反时语句失败。教学例子要么保证插入的都是合法行，要么用 OR IGNORE 配上你能 SELECT 出来的结果。不要把错误消息全文写进期望。

```sqlite run expect="1" title="比较是空"
SELECT (1 = NULL) IS NULL;
```

```sqlite run expect="7" title="替补"
SELECT COALESCE(NULL, 7);
```

```sqlite run expect="2" title="忽略重复"
CREATE TABLE t(id INTEGER PRIMARY KEY, n INTEGER NOT NULL);
INSERT INTO t VALUES (1, 2);
INSERT OR IGNORE INTO t VALUES (1, 9);
SELECT n FROM t;
```

### 读「比较是空」

先做这一例。把代码收成一行来记：`SELECT (1 = NULL) IS NULL;`。先盖住终端，写下你预测的输出，里面要能找到「1」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 读「替补」

做完上一例再做这一例。把代码收成一行来记：`SELECT COALESCE(NULL, 7);`。先盖住终端，写下你预测的输出，里面要能找到「7」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 读「忽略重复」

做完上一例再做这一例。把代码收成一行来记：`CREATE TABLE t(id INTEGER PRIMARY KEY, n INTEGER NOT NULL); INSERT INTO t VALUES (1, 2); INSERT OR IGNORE INTO t VALUES (1, 9); SELECT n FROM t;`。先盖住终端，写下你预测的输出，里面要能找到「2」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 只改一处：比较是空

这一例要避开的失误是：写 WHERE col = NULL，一行都留不下来。。对应的做法是：缺失只用 IS NULL 或 COALESCE。。

把代码收成一行来核对：`SELECT (1 = NULL) IS NULL;`。盖住终端，先写下预测，里面要能找到「1」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「1」才算失败。

### 只改一处：替补

这一例要避开的失误是：主键冲突不处理，后面的查询没有执行。。对应的做法是：允许重复插入被丢掉时写 INSERT OR IGNORE，并 SELECT 剩下的值。。

把代码收成一行来核对：`SELECT COALESCE(NULL, 7);`。盖住终端，先写下预测，里面要能找到「7」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「7」才算失败。

### 只改一处：忽略重复

这一例要避开的失误是：把 NULL 和 0 当成同一种「没有」。。对应的做法是：NOT NULL 的列在 VALUES 里就给值。。

把代码收成一行来核对：`CREATE TABLE t(id INTEGER PRIMARY KEY, n INTEGER NOT NULL); INSERT INTO t VALUES (1, 2); INSERT OR IGNORE INTO t VALUES (1, 9); SELECT n FROM t;`。盖住终端，先写下预测，里面要能找到「2」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「2」才算失败。

## 读完再动手

本章要留下的是 「用 IS NULL 判断缺失」、「用主键挡住重复」、「用 NOT NULL 挡住空值」。合上抽屉之前，用自己的话说出每一项目标对应哪一个示例的标题。对不上标题，就还没有把目标和代码连起来，先别展开练习答案。

练习的答案默认折着。先在编辑器里自己写，再展开对照。对照时只看输出是否包含期望的那几个字。两道都过了再进入下一章。下一次运行是新进程，这次的变量不会留下。

把这一章当成一次可以反复撤销的实验。点代码块上的 Run 会用示例覆盖编辑器，原来的草稿先备份。你改过的内容如果还想留着，先复制到别处，再点下一例。工具栏的 Run 不会从文档重写编辑器，所以它用来看你改过的版本。两种按钮各做各的事。下载进度写在按钮旁边，第一次打开这种语言时要等它结束，再判断示例是不是写错了。

记录你预测错的那一次。写下你以为会打印的文字，以及实际多出来或少掉的部分。进入下一章之前，要能用一句话说清差在哪。通过只说明期望的那几个字还在，不说明你已经看懂产生它的那一行。章节标题下的目标就是这份验收清单。差两个字也不要靠改期望凑过去。

## 常见错误

- 写 WHERE col = NULL，一行都留不下来。
- 主键冲突不处理，后面的查询没有执行。
- 把 NULL 和 0 当成同一种「没有」。

## 最佳实践

- 缺失只用 IS NULL 或 COALESCE。
- 允许重复插入被丢掉时写 INSERT OR IGNORE，并 SELECT 剩下的值。
- NOT NULL 的列在 VALUES 里就给值。

## 小结

NULL 不能用等号判断。主键挡住重复，NOT NULL 挡住缺失。OR IGNORE 让冲突的一行消失而脚本继续。

## 练习

把 NULL 收成 0 并选出。

::: answer 参考答案：替补零
```sqlite run expect="0" title="参考答案"
SELECT COALESCE(NULL, 0);
```
:::

主键插入两次 1，忽略第二次，选出行数。

::: answer 参考答案：一行
```sqlite run expect="1" title="参考答案"
CREATE TABLE t(id INTEGER PRIMARY KEY);
INSERT INTO t VALUES (1);
INSERT OR IGNORE INTO t VALUES (1);
SELECT COUNT(*) FROM t;
```
:::

## 延伸阅读

- [SQLite SQL Language Reference](https://www.sqlite.org/lang.html)（公有领域，仅链接）
- [SQLBolt](https://sqlbolt.com/)（仅链接）
- [Select Star SQL](https://selectstarsql.com/)（仅链接）

## 参考与致谢

正文为原创。知识点范围参考了 SQLite 语言参考、SQLBolt 与 Select Star SQL，没有逐字搬用原文。
