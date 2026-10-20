---
language: sqlite
chapter: 29
title: "SQLite UPSERT"
level: intermediate
minutes: 9
goals:
  - "冲突时用新值覆盖"
  - "冲突时在旧值上相加"
  - "冲突时保持原行"
sources:
  - sqlite-lang
updated: "2026-10-20"
---

`INSERT ... ON CONFLICT` 在唯一键冲突时改走更新或忽略。表上要有主键或唯一约束，否则没有冲突可处理。`excluded` 指的是这次没插进去的那一行。

### 覆盖成 5

茶的数量先是 2。再次插入同一主键并把数量写成 5，冲突分支把数量改成 `excluded.qty`。读出来是 5。

```sql run expect="5" title="覆盖数量"
CREATE TABLE stock (sku TEXT PRIMARY KEY, qty INT);
INSERT INTO stock VALUES ('tea', 2);
INSERT INTO stock (sku, qty) VALUES ('tea', 5)
  ON CONFLICT(sku) DO UPDATE SET qty = excluded.qty;
SELECT qty FROM stock WHERE sku = 'tea';
```

覆盖后是 5。

### 在旧数量上加

起点仍是 2，这次冲突时加上新来的 3。2 加 3 是 5。`stock.qty` 是已有行，`excluded.qty` 是想插入的行。

```sql run expect="5" title="加上 3"
CREATE TABLE stock (sku TEXT PRIMARY KEY, qty INT);
INSERT INTO stock VALUES ('tea', 2);
INSERT INTO stock (sku, qty) VALUES ('tea', 3)
  ON CONFLICT(sku) DO UPDATE SET qty = stock.qty + excluded.qty;
SELECT qty FROM stock WHERE sku = 'tea';
```

相加后是 5。

### 冲突就不动

`DO NOTHING` 留下原来的 2。新写的 9 被丢掉。

```sql run expect="2" title="保持 2"
CREATE TABLE stock (sku TEXT PRIMARY KEY, qty INT);
INSERT INTO stock VALUES ('tea', 2);
INSERT INTO stock (sku, qty) VALUES ('tea', 9)
  ON CONFLICT(sku) DO NOTHING;
SELECT qty FROM stock WHERE sku = 'tea';
```

数量仍是 2。

### 练习：新货号会插进去

茶已存在，杯是新的主键，不会冲突。插完之后表里有 2 行。

```sql run expect="2" title="两行库存"
CREATE TABLE stock (sku TEXT PRIMARY KEY, qty INT);
INSERT INTO stock VALUES ('tea', 2);
INSERT INTO stock (sku, qty) VALUES ('cup', 1)
  ON CONFLICT(sku) DO UPDATE SET qty = excluded.qty;
SELECT COUNT(*) FROM stock;
```

行数是 2。
