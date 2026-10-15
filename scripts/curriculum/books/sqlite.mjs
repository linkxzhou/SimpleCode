import { book } from "./rich.mjs";

const links = `- [SQLite SQL Language Reference](https://www.sqlite.org/lang.html)（公有领域，仅链接）
- [SQLBolt](https://sqlbolt.com/)（仅链接）
- [Select Star SQL](https://selectstarsql.com/)（仅链接）`;
const credit = "正文为原创。知识点范围参考了 SQLite 语言参考、SQLBolt 与 Select Star SQL，没有逐字搬用原文。";

const s = (title, code, expect, extra = {}) => ({ title, code, expect, ...extra });
const tail = { links, credit };

const chapters = [
  {
    chapter: 0,
    slug: "index",
    title: "概览：SQL 在这个抽屉里",
    goals: ["知道每次运行都是空的内存库", "用 SELECT 把结果打出来", "分清可运行示例和只读示例"],
    prose: `SQL 在这里由 SQLite 执行。点代码块上的 Run，整份脚本会在一个新的内存数据库里跑完。上一次建的表、插进去的行都不会留下。没有要连接的服务器，也没有上次还在的磁盘文件。

脚本用批处理读入，成功的建表和插入不会自己打印。要核对的结果必须写成 SELECT，期望是结果单元格里的子串。多列用竖线分开，不要依赖表头开关打出来的列名。

这里没有 JSON 扩展。ATTACH 出去的文件下一次运行也不在，所以可运行示例只使用这一次内存库里的表。期望写短一点，多出来的列不会让子串失败。`,
    samples: [
      s("只读", "-- JSON 扩展没有装，不要在可运行示例里调用 json()。\n-- ATTACH 写出的文件下次运行不在。", "", { norun: true }),
      s("相加", "SELECT 19 + 23;", "42"),
      s("问候", "SELECT '你好';", "你好"),
    ],
    mistakes: [
      "以为上一份脚本建的表还在。每次 Run 都是空库。",
      "只写 INSERT，终端里什么都没有，还以为失败了。",
      "把期望写成带表头的整段输出。",
    ],
    practices: [
      "每个示例都是一份能单独跑完的脚本，需要的表在同一份里建好。",
      "要核对的值用 SELECT 打出来。",
      "做不到的事用只读块标出来。",
    ],
    summary: "SQL 101 的例子在一次新的内存库里运行。结果靠 SELECT。单元格文本是期望的子串，列之间用竖线。",
    exercises: [
      { title: "参考答案：语言名", prompt: "选出一行文本 SQL。", code: "SELECT 'SQL';", expect: "SQL" },
      { title: "参考答案：乘积", prompt: "选出 6 和 7 的乘积。", code: "SELECT 6 * 7;", expect: "42" },
    ],
    ...tail,
  },
  {
    chapter: 1,
    slug: "literals",
    title: "字面量与 SELECT",
    level: "beginner",
    goals: ["用 SELECT 计算数字和文本", "分清单引号和双引号", "认出类型名"],
    prose: `SELECT 后面可以不跟表，直接算出一个值。整数相除仍是整数，20 / 6 得到 3，余数用 %。需要小数时写成 20 / 6.0。文本用单引号。双引号在 SQL 里通常是标识符，拿来包中文句子会去找同名的列，找不到就报错。

|| 把文本接起来。数字和文本不能直接相加，SQLite 会按自己的规则转换，结果往往不是你想的拼接。先用 CAST 或直接写文本。

typeof 打出 SQLite 看到的类型名：integer、real、text、null。NULL 不是 0，也不是空字符串。1 / 0 在 SQLite 里得到 NULL，而不是让整份脚本停下来。`,
    samples: [
      s("整除", "SELECT 20 / 6, 20 % 6;", "3|2"),
      s("拼接", "SELECT 'A' || 'B';", "AB"),
      s("类型", "SELECT typeof(42), typeof(NULL);", "integer|null"),
    ],
    mistakes: [
      "用双引号包要打印的句子。",
      "以为 20 / 6 会得到小数。",
      "用 1 / 0 期待报错。SQLite 给出 NULL。",
    ],
    practices: [
      "要打印的文本只用单引号。",
      "要小数时写浮点字面量。",
      "看不清类型时 SELECT typeof。",
    ],
    summary: "SELECT 可以不带表。单引号是文本，整数相除丢掉小数，typeof 用来核对类型。除以零得到 NULL。",
    exercises: [
      { title: "参考答案：商", prompt: "选出 17 除以 5 的整数商。", code: "SELECT 17 / 5;", expect: "3" },
      { title: "参考答案：斜线", prompt: "把 2026-10-15 里的横线换成斜线。", code: "SELECT replace('2026-10-15', '-', '/');", expect: "2026/10/15" },
    ],
    ...tail,
  },
  {
    chapter: 2,
    slug: "tables",
    title: "建表与 INSERT",
    level: "beginner",
    goals: ["建出带列的表", "插入一行和多行", "用 SELECT 读回刚插入的值"],
    prose: `CREATE TABLE 给出表名和列。列可以写类型提示，SQLite 仍按值保存，类型提示是给人和约束看的。同一份脚本里先建表再插入，因为库是空的。

INSERT INTO 表名 VALUES 按列的顺序给值。一次可以写多行，用逗号隔开。指定列名时，没写到的列是 NULL，除非建表时给了默认或非空约束。

插入成功时终端通常是空的。紧接着写 SELECT，才能看见行。SELECT * 会把每一列打出来，列与列之间是竖线。列多的时候改成只选你要核对的那一列，期望更稳。`,
    samples: [
      s("两行", "CREATE TABLE t(n INTEGER);\nINSERT INTO t VALUES (1), (2);\nSELECT COUNT(*) FROM t;", "2"),
      s("指定列", "CREATE TABLE t(id INTEGER, name TEXT);\nINSERT INTO t(id, name) VALUES (1, 'Ada');\nSELECT name FROM t;", "Ada"),
      s("求和", "CREATE TABLE scores(name TEXT, n INTEGER);\nINSERT INTO scores VALUES ('Ada', 1);\nINSERT INTO scores VALUES ('Ada', 2);\nSELECT SUM(n) FROM scores;", "3"),
    ],
    mistakes: [
      "只插入不查询，把空白终端当成失败。",
      "VALUES 的个数和列对不上。",
      "依赖上一份脚本里已经建好的表。",
    ],
    practices: [
      "建表、插入、查询写在同一份脚本里。",
      "列多时只 SELECT 要核对的列。",
      "一次插入多行时，每一行的值个数相同。",
    ],
    summary: "表在本次运行里创建。INSERT 不打印，SELECT 才打印。列按顺序或按名字对应。",
    exercises: [
      { title: "参考答案：三行", prompt: "建表插入 1、2、3，选出行数。", code: "CREATE TABLE t(n INTEGER);\nINSERT INTO t VALUES (1), (2), (3);\nSELECT COUNT(*) FROM t;", expect: "3" },
      { title: "参考答案：名字", prompt: "建表插入 Ada，选出这个名字。", code: "CREATE TABLE t(name TEXT);\nINSERT INTO t VALUES ('Ada');\nSELECT name FROM t;", expect: "Ada" },
    ],
    ...tail,
  },
  {
    chapter: 3,
    slug: "where",
    title: "WHERE",
    level: "beginner",
    goals: ["用比较和逻辑留下行", "知道 0 在条件里为假", "不把空字符串和 NULL 混在一起"],
    prose: `WHERE 写在 FROM 后面，留下使条件为真的行。比较有 =、<>、>、<。AND 和 OR 把条件连起来。更具体的范围用括号，不要靠记忆优先级。

在 CASE WHEN 和 WHERE 里，0 是假，非零是真。这和 Ruby 相反。空字符串不是 NULL，<> '' 能把它滤掉，却滤不掉 NULL。NULL 的比较结果仍是 NULL，WHERE 不会留下它。

LIKE 做简单的模式，% 匹配任意一段。教学例子优先用 = 和比较，模式只在你确实要「包含某段文字」时再用。`,
    samples: [
      s("奇数和", "CREATE TABLE t(n INTEGER);\nINSERT INTO t VALUES (1), (2), (3), (4), (5);\nSELECT SUM(n) FROM t WHERE n % 2 = 1;", "9"),
      s("零是假", "SELECT CASE WHEN 0 THEN 'yes' ELSE 'no' END;", "no"),
      s("去掉空串", "CREATE TABLE t(name TEXT);\nINSERT INTO t VALUES ('Ada'), (''), ('Grace');\nSELECT COUNT(*) FROM t WHERE name <> '';", "2"),
    ],
    mistakes: [
      "用 WHERE name 判断名字是不是空的。0 和空结果的规则与 Ruby 不同。",
      "把空字符串写成 NULL，比较又对不上。",
      "OR 和 AND 混写却不加括号。",
    ],
    practices: [
      "先用 SELECT 打出全部行，再加 WHERE，确认少掉的是你想少的。",
      "空字符串用 <> ''，缺失用 IS NULL。",
      "多个条件加括号。",
    ],
    summary: "WHERE 留下条件为真的行。0 为假。空字符串和 NULL 不是同一种缺失，比较也不同。",
    exercises: [
      { title: "参考答案：大于二", prompt: "从 1 到 4 里留下大于 2 的数，选出它们的和。", code: "CREATE TABLE t(n INTEGER);\nINSERT INTO t VALUES (1), (2), (3), (4);\nSELECT SUM(n) FROM t WHERE n > 2;", expect: "7" },
      { title: "参考答案：非零", prompt: "选出 CASE：3 为真时打印 yes。", code: "SELECT CASE WHEN 3 THEN 'yes' ELSE 'no' END;", expect: "yes" },
    ],
    ...tail,
  },
  {
    chapter: 4,
    slug: "agg",
    title: "聚合",
    level: "intermediate",
    goals: ["用 COUNT、SUM、MIN、MAX", "用 GROUP BY 分组", "分清 COUNT(*) 和 COUNT(列)"],
    prose: `聚合把多行收成一行。COUNT(*) 数行，包括 NULL。COUNT(列) 不数该列是 NULL 的行。SUM 忽略 NULL。空表的 SUM 是 NULL，不是 0。要显示 0 时用 COALESCE(SUM(n), 0)。

GROUP BY 按列的值分组，每一组产生一行聚合。SELECT 里除了聚合函数，只放分组列。ORDER BY 可以排组的结果。没有 GROUP BY 时，整张表是一组。

WHERE 在分组前过滤行。分组之后还要丢掉某些组，用 HAVING。本教程的例子能用 WHERE 就不用 HAVING，少一层。`,
    samples: [
      s("最小最大", "CREATE TABLE t(n INTEGER);\nINSERT INTO t VALUES (3), (1), (2);\nSELECT MIN(n), MAX(n), SUM(n) FROM t;", "1|2|6"),
      s("分组", "CREATE TABLE t(name TEXT, n INTEGER);\nINSERT INTO t VALUES ('a', 1), ('a', 2), ('b', 5);\nSELECT name, SUM(n) FROM t GROUP BY name ORDER BY name;", "a|3"),
      s("不数空", "SELECT COUNT(*), COUNT(n) FROM (SELECT 1 AS n UNION ALL SELECT NULL);", "2|1"),
    ],
    mistakes: [
      "用 COUNT(列) 以为在数全部行，NULL 被悄悄丢掉。",
      "SELECT 里放了既不分组也不聚合的列。",
      "空组的 SUM 是 NULL，直接拿去相加又得到 NULL。",
    ],
    practices: [
      "数行用 COUNT(*)，数有值的格子用 COUNT(列)。",
      "分组后的 SELECT 只留分组列和聚合。",
      "可能没有行时用 COALESCE 把 SUM 收成 0。",
    ],
    summary: "聚合把多行收成少数行。COUNT(*) 与 COUNT(列) 对 NULL 的态度不同。GROUP BY 决定一组是谁。",
    exercises: [
      { title: "参考答案：总和", prompt: "插入 1、2、3、4，选出和。", code: "CREATE TABLE t(n INTEGER);\nINSERT INTO t VALUES (1), (2), (3), (4);\nSELECT SUM(n) FROM t;", expect: "10" },
      { title: "参考答案：两组", prompt: "a 有两行，选出分组后的组数。", code: "CREATE TABLE t(name TEXT);\nINSERT INTO t VALUES ('a'), ('a'), ('b');\nSELECT COUNT(*) FROM (SELECT name FROM t GROUP BY name);", expect: "2" },
    ],
    ...tail,
  },
  {
    chapter: 5,
    slug: "joins",
    title: "连接",
    level: "intermediate",
    goals: ["用 JOIN 按键配对", "用 LEFT JOIN 留下没有配对的行", "避免忘记连接条件"],
    prose: `JOIN 把两张表按条件配成一行。ON 里写键相等。忘记 ON，就会得到每一行对每一行的乘积，行数是两边相乘，数字看起来像算错过。

INNER JOIN 只留两边都配上的行。LEFT JOIN 保留左表全部行，右表没有配对时那些列是 NULL。要找「左表有、右表没有」的行，在 LEFT JOIN 之后写 WHERE 右表的键 IS NULL。

一张表也可以和自己的子查询连接。给表起短别名，SELECT 里写别名.列，避免两张表都有 id 时分不清。`,
    samples: [
      s("配对求和", "CREATE TABLE person(id INTEGER, name TEXT);\nCREATE TABLE score(pid INTEGER, n INTEGER);\nINSERT INTO person VALUES (1, 'Ada'), (2, 'Grace');\nINSERT INTO score VALUES (1, 4), (1, 5);\nSELECT person.name, SUM(score.n) FROM person JOIN score ON person.id = score.pid GROUP BY person.name;", "Ada|9"),
      s("没有配对", "CREATE TABLE a(id INTEGER, name TEXT);\nCREATE TABLE b(id INTEGER);\nINSERT INTO a VALUES (1, 'Ada'), (2, 'Grace');\nINSERT INTO b VALUES (1);\nSELECT a.name FROM a LEFT JOIN b ON a.id = b.id WHERE b.id IS NULL;", "Grace"),
      s("两数相乘", "SELECT a.n * b.n FROM (SELECT 6 AS n) AS a JOIN (SELECT 7 AS n) AS b ON 1 = 1;", "42"),
    ],
    mistakes: [
      "JOIN 不写 ON，行数变成乘积。",
      "用 WHERE 右表列 = 某值，把 LEFT JOIN 又滤回内连接。",
      "两张表都有同名列，SELECT 不写表名。",
    ],
    practices: [
      "每个 JOIN 都写 ON。",
      "找缺失配对时用 LEFT JOIN 再 IS NULL。",
      "列名冲突时写表名或别名。",
    ],
    summary: "JOIN 按 ON 配对。内连接丢掉配不上的行，左连接留住左表并用 NULL 表示右边缺失。",
    exercises: [
      { title: "参考答案：只留配上的", prompt: "人 1 叫 Ada，分数只记在 1 上，选出名字。", code: "CREATE TABLE person(id INTEGER, name TEXT);\nCREATE TABLE score(pid INTEGER);\nINSERT INTO person VALUES (1, 'Ada'), (2, 'Grace');\nINSERT INTO score VALUES (1);\nSELECT person.name FROM person JOIN score ON person.id = score.pid;", expect: "Ada" },
      { title: "参考答案：乘积", prompt: "选出 4 和 5 的乘积，用两个一行的子查询连接。", code: "SELECT a.n * b.n FROM (SELECT 4 AS n) AS a JOIN (SELECT 5 AS n) AS b ON 1 = 1;", expect: "20" },
    ],
    ...tail,
  },
  {
    chapter: 6,
    slug: "mutate",
    title: "UPDATE 与 DELETE",
    level: "intermediate",
    goals: ["按条件改列", "按条件删行", "改完用 SELECT 核对"],
    prose: `UPDATE 改已经在表里的行。SET 写新值，WHERE 限制改哪些行。没有 WHERE 的 UPDATE 会改全表。写之前先用同样的 WHERE 做一次 SELECT，确认将要改的是那些行。

DELETE 删行，不删表。没有 WHERE 会清空表，表结构还在。DROP TABLE 才丢掉表。本教程的例子需要清空时用 DELETE，同一份脚本后面还能再插入。

UPDATE 和 DELETE 本身不打印受影响的行数。改完写 SELECT SUM 或 COUNT，用数字核对。不要靠终端空白判断改成功了没有。`,
    samples: [
      s("加一", "CREATE TABLE t(n INTEGER);\nINSERT INTO t VALUES (1), (2), (3);\nUPDATE t SET n = n + 1 WHERE n = 1;\nSELECT SUM(n) FROM t;", "7"),
      s("删小的", "CREATE TABLE t(n INTEGER);\nINSERT INTO t VALUES (1), (2), (3);\nDELETE FROM t WHERE n < 3;\nSELECT SUM(n) FROM t;", "3"),
      s("清空", "CREATE TABLE t(n INTEGER);\nINSERT INTO t VALUES (1);\nDELETE FROM t;\nSELECT COUNT(*) FROM t;", "0"),
    ],
    mistakes: [
      "UPDATE 忘了 WHERE，全表被改成同一个值。",
      "把 DELETE 当成 DROP，以为表也不见了。",
      "不写 SELECT，只看终端没有输出。",
    ],
    practices: [
      "先 SELECT 再 UPDATE，WHERE 保持同一份。",
      "清空用 DELETE，拆表用 DROP，两件事分开。",
      "改完用 SUM 或 COUNT 打出你要的数。",
    ],
    summary: "UPDATE 改列，DELETE 删行。两者都不打印结果。没有 WHERE 就作用于整张表，改完一定 SELECT。",
    exercises: [
      { title: "参考答案：改名", prompt: "把 id 为 1 的名字改成 Ada 并选出。", code: "CREATE TABLE t(id INTEGER, name TEXT);\nINSERT INTO t VALUES (1, 'x');\nUPDATE t SET name = 'Ada' WHERE id = 1;\nSELECT name FROM t;", expect: "Ada" },
      { title: "参考答案：删一", prompt: "删掉等于 2 的行，选出剩下的和。", code: "CREATE TABLE t(n INTEGER);\nINSERT INTO t VALUES (1), (2), (3);\nDELETE FROM t WHERE n = 2;\nSELECT SUM(n) FROM t;", expect: "4" },
    ],
    ...tail,
  },
  {
    chapter: 7,
    slug: "nulls",
    title: "NULL 与约束",
    level: "intermediate",
    goals: ["用 IS NULL 判断缺失", "用主键挡住重复", "用 NOT NULL 挡住空值"],
    prose: `NULL 表示没有值。= NULL 的结果不是真，也不是假，而是 NULL。要判断缺失，写 IS NULL 或 IS NOT NULL。COALESCE(值, 替补) 在值是 NULL 时改用替补。

PRIMARY KEY 让这一列不能重复。再插入同一个键会失败，整句停住，后面的 SELECT 也可能跑不到。若重复是可以忽略的情况，用 INSERT OR IGNORE，冲突的那一行被丢掉，脚本继续。

NOT NULL 拒绝这一列没有值。和主键一样，违反时语句失败。教学例子要么保证插入的都是合法行，要么用 OR IGNORE 配上你能 SELECT 出来的结果。不要把错误消息全文写进期望。`,
    samples: [
      s("比较是空", "SELECT (1 = NULL) IS NULL;", "1"),
      s("替补", "SELECT COALESCE(NULL, 7);", "7"),
      s("忽略重复", "CREATE TABLE t(id INTEGER PRIMARY KEY, n INTEGER NOT NULL);\nINSERT INTO t VALUES (1, 2);\nINSERT OR IGNORE INTO t VALUES (1, 9);\nSELECT n FROM t;", "2"),
    ],
    mistakes: [
      "写 WHERE col = NULL，一行都留不下来。",
      "主键冲突不处理，后面的查询没有执行。",
      "把 NULL 和 0 当成同一种「没有」。",
    ],
    practices: [
      "缺失只用 IS NULL 或 COALESCE。",
      "允许重复插入被丢掉时写 INSERT OR IGNORE，并 SELECT 剩下的值。",
      "NOT NULL 的列在 VALUES 里就给值。",
    ],
    summary: "NULL 不能用等号判断。主键挡住重复，NOT NULL 挡住缺失。OR IGNORE 让冲突的一行消失而脚本继续。",
    exercises: [
      { title: "参考答案：替补零", prompt: "把 NULL 收成 0 并选出。", code: "SELECT COALESCE(NULL, 0);", expect: "0" },
      { title: "参考答案：一行", prompt: "主键插入两次 1，忽略第二次，选出行数。", code: "CREATE TABLE t(id INTEGER PRIMARY KEY);\nINSERT INTO t VALUES (1);\nINSERT OR IGNORE INTO t VALUES (1);\nSELECT COUNT(*) FROM t;", expect: "1" },
    ],
    ...tail,
  },
  {
    chapter: 8,
    slug: "subquery",
    title: "子查询",
    level: "advanced",
    goals: ["在 FROM 里写一个派生表", "在 WHERE 里和聚合比较", "用标量子查询算出一个数"],
    prose: `子查询是包在括号里的 SELECT。放在 FROM 里时它像一张临时表，要起别名。放在 WHERE 里时，若它只返回一个值，可以和列比较。返回多行却用了单个比较，语句会失败。

标量子查询放在表达式里，必须正好一行一列。没有行时它是 NULL。用它做除法或拼接之前先想清楚没有行会怎样。

能用 JOIN 写清楚的配对，不必塞进子查询。子查询适合「先算出一个总数，再和每一行比」。平均分、最大分都属于这种。`,
    samples: [
      s("一个数", "SELECT n FROM (SELECT 6 * 7 AS n);", "42"),
      s("高于平均", "CREATE TABLE t(n INTEGER);\nINSERT INTO t VALUES (1), (5), (3);\nSELECT n FROM t WHERE n > (SELECT AVG(n) FROM t);", "5"),
      s("两个标量", "SELECT (SELECT 19) + (SELECT 23);", "42"),
    ],
    mistakes: [
      "FROM 子查询不起别名。",
      "子查询返回多行，却用 = 去比。",
      "没有行的标量子查询拿去当 0 使用。",
    ],
    practices: [
      "派生表立刻写 AS 别名。",
      "和单个值比较之前，确认子查询只有一列并且你接受多行会失败。",
      "配对两张表优先用 JOIN。",
    ],
    summary: "子查询可以当临时表，也可以当一个数。当一个数时只能有一行一列，没有行就是 NULL。",
    exercises: [
      { title: "参考答案：平方", prompt: "从派生表选出 6 的平方。", code: "SELECT n * n FROM (SELECT 6 AS n);", expect: "36" },
      { title: "参考答案：最大", prompt: "选出大于最大值减 1 的数。表里是 1、2、4。", code: "CREATE TABLE t(n INTEGER);\nINSERT INTO t VALUES (1), (2), (4);\nSELECT n FROM t WHERE n > (SELECT MAX(n) - 1 FROM t);", expect: "4" },
    ],
    ...tail,
  },
  {
    chapter: 9,
    slug: "order",
    title: "排序与限制",
    level: "advanced",
    goals: ["用 ORDER BY 固定顺序", "用 LIMIT 只要前几行", "用 OFFSET 跳过开头"],
    prose: `没有 ORDER BY 时，行的顺序不保证。刚插入的顺序常常还在，但不能写成期望里的依据。要核对「第一行是谁」，必须 ORDER BY。

LIMIT 在排序之后留下前几行。OFFSET 先跳过若干行再留下。OFFSET 很大时，数据库仍要先排完再丢，教学数据很小，可以这样写。页码从 0 开始跳：第一页 OFFSET 0。

NULL 在排序里的位置容易看错。本教程的排序列都放上非空的数或文本。文本按二进制顺序，大写和小写、英文和中文不要混在同一道要精确顺序的题里。`,
    samples: [
      s("最小的两个", "CREATE TABLE t(n INTEGER);\nINSERT INTO t VALUES (3), (1), (2);\nSELECT n FROM t ORDER BY n LIMIT 2;", "1"),
      s("字母序第一", "CREATE TABLE t(name TEXT);\nINSERT INTO t VALUES ('b'), ('a'), ('c');\nSELECT name FROM t ORDER BY name LIMIT 1;", "a"),
      s("跳过最大", "CREATE TABLE t(n INTEGER);\nINSERT INTO t VALUES (1), (2), (3), (4);\nSELECT n FROM t ORDER BY n DESC LIMIT 1 OFFSET 1;", "3"),
    ],
    mistakes: [
      "不写 ORDER BY，却期望第一行永远是刚插入的那行。",
      "LIMIT 写在 ORDER BY 前面，语法失败。",
      "把 OFFSET 理解成留下的行数。",
    ],
    practices: [
      "要稳定的第一行就写 ORDER BY 和 LIMIT。",
      "顺序是 ORDER BY、LIMIT、OFFSET。",
      "排序列避免 NULL。",
    ],
    summary: "顺序只在 ORDER BY 之后才算数。LIMIT 留下前几行，OFFSET 先跳过。没有排序的「第一行」不能当结果。",
    exercises: [
      { title: "参考答案：最小", prompt: "从 3、1、2 里选出最小的数。", code: "CREATE TABLE t(n INTEGER);\nINSERT INTO t VALUES (3), (1), (2);\nSELECT n FROM t ORDER BY n LIMIT 1;", expect: "1" },
      { title: "参考答案：第二小", prompt: "选出第二小的数。数据是 4、1、3。", code: "CREATE TABLE t(n INTEGER);\nINSERT INTO t VALUES (4), (1), (3);\nSELECT n FROM t ORDER BY n LIMIT 1 OFFSET 1;", expect: "3" },
    ],
    ...tail,
  },
  {
    chapter: 10,
    slug: "txn",
    title: "事务",
    level: "advanced",
    goals: ["用 BEGIN 和 COMMIT 提交一组写入", "用 ROLLBACK 撤销这一组", "知道脚本结束前要明确提交"],
    prose: `BEGIN 开始一组写入，COMMIT 让它们留下，ROLLBACK 全部撤销。账本里「加一笔记上一笔」应该在同一组里：要么都在，要么都不在。

本环境每次运行都是新库，事务只在这一份脚本里有意义。COMMIT 之后同一份脚本里的 SELECT 能看见这些行。ROLLBACK 之后 SELECT 应当看不见。不要把 COMMIT 理解成写到磁盘上、下次 Run 还在。下次仍是空库。

忘记 COMMIT 就结束，这一组可能不会留下。示例里要么 COMMIT 再查询，要么 ROLLBACK 再查询，两种结果都用数字说清楚。`,
    samples: [
      s("撤销", "CREATE TABLE t(n INTEGER);\nBEGIN;\nINSERT INTO t VALUES (1);\nROLLBACK;\nSELECT COUNT(*) FROM t;", "0"),
      s("提交", "CREATE TABLE t(n INTEGER);\nBEGIN;\nINSERT INTO t VALUES (1);\nCOMMIT;\nSELECT COUNT(*) FROM t;", "1"),
      s("两笔一起", "CREATE TABLE t(n INTEGER);\nBEGIN;\nINSERT INTO t VALUES (1);\nINSERT INTO t VALUES (2);\nCOMMIT;\nSELECT SUM(n) FROM t;", "3"),
    ],
    mistakes: [
      "以为 COMMIT 会让下一轮 Run 还能看见这些行。",
      "BEGIN 之后既不 COMMIT 也不 ROLLBACK，就去猜结果。",
      "把两笔不相关的修改放进同一事务，失败时一起被撤销。",
    ],
    practices: [
      "一组要同时留下的写入放进 BEGIN 和 COMMIT。",
      "演示撤销时用 ROLLBACK，紧接着 SELECT COUNT。",
      "记住下次运行库是空的，事务救不了跨运行的数据。",
    ],
    summary: "事务让一组写入同时留下或同时消失。COMMIT 只保证这一份脚本的后半能看见。下次运行仍从空库开始。",
    exercises: [
      { title: "参考答案：撤销两笔", prompt: "插入 4 和 5 后回滚，选出行数。", code: "CREATE TABLE t(n INTEGER);\nBEGIN;\nINSERT INTO t VALUES (4), (5);\nROLLBACK;\nSELECT COUNT(*) FROM t;", expect: "0" },
      { title: "参考答案：留下", prompt: "提交一行 9，选出这个数。", code: "CREATE TABLE t(n INTEGER);\nBEGIN;\nINSERT INTO t VALUES (9);\nCOMMIT;\nSELECT n FROM t;", expect: "9" },
    ],
    ...tail,
  },
  {
    chapter: 11,
    slug: "ledger",
    title: "账本小项目",
    level: "advanced",
    goals: ["用一张明细表记下每一笔", "按名字汇总", "用事务包住互相依赖的两笔"],
    prose: `账本只保留明细：谁、多少。总分用 SUM 现算，不另存一个容易和明细打架的余额列。同一份脚本里建表、插入、汇总。没有网络，也没有下次还在的文件。

按名字汇总用 GROUP BY。只要一个人的总分就在 WHERE 里写名字。行数用 COUNT，人数用 COUNT(DISTINCT name)。退回写成负数的一笔，不要去改历史行，这样每一笔还在。

两笔必须同时留下时放进事务。例如转入和转出。演示时可以 COMMIT 后选出两边的和，确认没有多出来的数。查询只打你要核对的那一个数字。`,
    samples: [
      s("一个人的总分", "CREATE TABLE lines(name TEXT, n INTEGER);\nINSERT INTO lines VALUES ('Ada', 1);\nINSERT INTO lines VALUES ('Ada', 2);\nINSERT INTO lines VALUES ('Grace', 4);\nSELECT SUM(n) FROM lines WHERE name = 'Ada';", "3"),
      s("人数", "CREATE TABLE lines(name TEXT, n INTEGER);\nINSERT INTO lines VALUES ('Ada', 1), ('Grace', 2);\nSELECT COUNT(DISTINCT name) FROM lines;", "2"),
      s("退回仍在", "CREATE TABLE lines(name TEXT, n INTEGER);\nINSERT INTO lines VALUES ('Ada', 5), ('Ada', -1);\nSELECT SUM(n) FROM lines;", "4"),
    ],
    mistakes: [
      "另存一个余额列，明细改了余额忘了改。",
      "退回时删除原来的行，历史没了。",
      "把账本写进 ATTACH 的文件，下一次运行找不到。",
    ],
    practices: [
      "只存明细，总分用 SUM。",
      "更正用新的一笔，不改旧行。",
      "必须同时成功的两笔放进一个事务。",
    ],
    summary: "账本是一张明细表。总分是查询，不是另一列。负数表示退回。事务只在这一次运行里保证两笔一起留下。",
    exercises: [
      { title: "参考答案：两条", prompt: "插入 Ada 和 Grace 各一笔，选出不同名字的个数。", code: "CREATE TABLE lines(name TEXT, n INTEGER);\nINSERT INTO lines VALUES ('Ada', 1), ('Grace', 2);\nSELECT COUNT(DISTINCT name) FROM lines;", expect: "2" },
      { title: "参考答案：相加", prompt: "Ada 先记 4 再记 5，选出总分。", code: "CREATE TABLE lines(name TEXT, n INTEGER);\nINSERT INTO lines VALUES ('Ada', 4), ('Ada', 5);\nSELECT SUM(n) FROM lines WHERE name = 'Ada';", expect: "9" },
    ],
    ...tail,
  },
];

export const pages = book("sqlite", ["sqlite-lang", "sqlbolt", "select-star"], chapters);
