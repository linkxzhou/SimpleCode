---
language: sqlite
chapter: 27
title: "SQLite recursive queries"
level: advanced
minutes: 10
goals:
  - "Generate a run of integers recursively"
  - "Walk a small tree through manager ids"
  - "Stop the recursion with a condition"
sources:
  - sqlite-lang
updated: "2026-10-20"
---

`WITH RECURSIVE` feeds a query's own result back in. There must be a condition that stops producing rows, or the run will not finish. The seed query is on the left of `UNION ALL`. The step is on the right.

### Add from one through three

The seed is 1. While `n < 3`, the step adds one, so the rows are 1, 2, and 3. Their sum is 6.

```sql run expect="6" title="1+2+3"
WITH RECURSIVE seq(n) AS (
  SELECT 1
  UNION ALL
  SELECT n + 1 FROM seq WHERE n < 3
)
SELECT SUM(n) FROM seq;
```

The sum is 6.

### From the root down to the leaf

In `emp`, ada has no manager, bea's manager is ada, and cy's manager is bea. Starting at ada and following `manager` downward includes all three people.

```sql run expect="3" title="Three people"
CREATE TABLE emp (id INT, manager INT, name TEXT);
INSERT INTO emp VALUES (1, NULL, 'ada'), (2, 1, 'bea'), (3, 2, 'cy');
WITH RECURSIVE team(id) AS (
  SELECT id FROM emp WHERE name = 'ada'
  UNION ALL
  SELECT emp.id FROM emp JOIN team ON emp.manager = team.id
)
SELECT COUNT(*) FROM team;
```

The team count is 3.

### A name from the level below

The seed is still ada. The step produces bea because bea's manager id is 1. Cy's manager is 2, so cy appears on the following step, not as a direct hop from ada. `ORDER BY` fixes the output. The expected text includes `bea`.

```sql run expect="bea" title="bea is below"
CREATE TABLE emp (id INT, manager INT, name TEXT);
INSERT INTO emp VALUES (1, NULL, 'ada'), (2, 1, 'bea'), (3, 2, 'cy');
WITH RECURSIVE team(id, name) AS (
  SELECT id, name FROM emp WHERE name = 'ada'
  UNION ALL
  SELECT emp.id, emp.name FROM emp JOIN team ON emp.manager = team.id
)
SELECT name FROM team ORDER BY id;
```

The names include `bea`.

### Exercise: add through four

The stop condition becomes `n < 4`. The sequence is 1, 2, 3, and 4, and the sum is 10. A limit of `n < 100` would take many more steps. This exercise stops at 4.

```sql run expect="10" title="Sum from 1 through 4"
WITH RECURSIVE seq(n) AS (
  SELECT 1
  UNION ALL
  SELECT n + 1 FROM seq WHERE n < 4
)
SELECT SUM(n) FROM seq;
```

The sum is 10.
