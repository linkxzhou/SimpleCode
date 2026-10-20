---
language: sqlite
chapter: 32
title: "SQLite query plans"
level: advanced
minutes: 9
goals:
  - "See a full scan when no index exists"
  - "See a lookup that uses an index"
  - "Check that the index does not change the answer"
sources:
  - sqlite-lang
updated: "2026-10-20"
---

`EXPLAIN QUERY PLAN` prints the lookup steps, not the result rows. The text contains `SCAN` or `INDEX`. Wording can gain a word between versions, so the expected substring is one of those stable pieces. A plan is not the answer. The same `SELECT` still has to be run if you want the value.

### No index means a scan

`item` has no index. The plan for a filter on the name contains `SCAN`.

```sql run expect="SCAN" title="Full scan"
CREATE TABLE item (name TEXT, price INT);
INSERT INTO item VALUES ('tea', 4);
EXPLAIN QUERY PLAN SELECT price FROM item WHERE name = 'tea';
```

The plan contains `SCAN`.

### The lookup uses an index

After an index on `name`, the plan for the same filter contains `INDEX`. This 3.26 build also mentions `SEARCH`. The check looks only for `INDEX`.

```sql run expect="INDEX" title="Uses an index"
CREATE TABLE item (name TEXT, price INT);
INSERT INTO item VALUES ('tea', 4);
CREATE INDEX item_name ON item(name);
EXPLAIN QUERY PLAN SELECT price FROM item WHERE name = 'tea';
```

The plan contains `INDEX`.

### The answer stays the same

With the index, the price is still 4. The index changes the lookup steps, not the value of this row.

```sql run expect="4" title="Price is still 4"
CREATE TABLE item (name TEXT, price INT);
INSERT INTO item VALUES ('tea', 4);
CREATE INDEX item_name ON item(name);
SELECT price FROM item WHERE name = 'tea';
```

The price is 4.

### Exercise: a primary key is an index too

`id` is a primary key. An equality lookup on that key also has `INDEX` in the plan. A separate `CREATE INDEX` is unnecessary.

```sql run expect="INDEX" title="Primary-key lookup"
CREATE TABLE item (id INT PRIMARY KEY, price INT);
INSERT INTO item VALUES (1, 4);
EXPLAIN QUERY PLAN SELECT price FROM item WHERE id = 1;
```

The primary-key plan contains `INDEX`.
