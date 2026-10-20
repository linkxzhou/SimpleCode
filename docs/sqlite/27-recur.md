---
language: sqlite
chapter: 27
title: "SQLite 递归查询"
level: advanced
minutes: 10
goals:
  - "用递归生成一段连续整数"
  - "沿着上级走出一棵小树"
  - "给递归加上停止条件"
sources:
  - sqlite-lang
updated: "2026-10-20"
---

`WITH RECURSIVE` 把查询自己的结果再喂回去。必须有一条不再产生新行的条件，否则这一次运行停不下来。种子查询写在 `UNION ALL` 左边，递推写在右边。

### 一加到三

种子是 1。只要 `n < 3` 就再加 1，于是有 1、2、3。三数之和是 6。

```sql run expect="6" title="1+2+3"
WITH RECURSIVE seq(n) AS (
  SELECT 1
  UNION ALL
  SELECT n + 1 FROM seq WHERE n < 3
)
SELECT SUM(n) FROM seq;
```

和是 6。

### 从根走到叶子

`emp` 里 ada 没有上级，bea 的上级是 ada，cy 的上级是 bea。从 ada 出发，沿着 `manager` 往下数，三个人都在结果里。

```sql run expect="3" title="三个人"
CREATE TABLE emp (id INT, manager INT, name TEXT);
INSERT INTO emp VALUES (1, NULL, 'ada'), (2, 1, 'bea'), (3, 2, 'cy');
WITH RECURSIVE team(id) AS (
  SELECT id FROM emp WHERE name = 'ada'
  UNION ALL
  SELECT emp.id FROM emp JOIN team ON emp.manager = team.id
)
SELECT COUNT(*) FROM team;
```

团队人数是 3。

### 只取直接下级的名字

种子仍然是 ada。递推只在种子那一层产生 bea，因为 bea 的上级编号是 1，而 cy 的上级是 2，不会从 ada 这一步直接跳出来。再下一步才会出现 cy。用 `ORDER BY` 固定输出，期望里能看到 `bea`。

```sql run expect="bea" title="下级里有 bea"
CREATE TABLE emp (id INT, manager INT, name TEXT);
INSERT INTO emp VALUES (1, NULL, 'ada'), (2, 1, 'bea'), (3, 2, 'cy');
WITH RECURSIVE team(id, name) AS (
  SELECT id, name FROM emp WHERE name = 'ada'
  UNION ALL
  SELECT emp.id, emp.name FROM emp JOIN team ON emp.manager = team.id
)
SELECT name FROM team ORDER BY id;
```

名字里有 `bea`。

### 练习：加到四

停止条件改成 `n < 4`，序列是 1、2、3、4，和是 10。条件写成 `n < 100` 会多走很多步，这一题停在 4。

```sql run expect="10" title="1 到 4 之和"
WITH RECURSIVE seq(n) AS (
  SELECT 1
  UNION ALL
  SELECT n + 1 FROM seq WHERE n < 4
)
SELECT SUM(n) FROM seq;
```

和是 10。
