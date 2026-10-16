---
language: sqlite
chapter: 6
title: "SQL Operators"
level: beginner
minutes: 8
goals:
  - "Compare two values"
  - "Combine tests with AND and OR"
  - "Test an inclusive range with BETWEEN"
sources:
  - sqlite-lang
updated: "2026-10-16"
---

A SQL condition yields 0 or 1. Zero is false. One is true.

### Comparison

A greater-than test that holds yields 1. An equality test that fails yields 0.

```sql run expect="1|0" title="True and false"
SELECT 3 > 1, 3 = 1;
```

`3 > 1` and `3 = 1` print together as `1|0`.

### AND and OR

`AND` yields 1 only when both sides are true. `OR` yields 1 when either side is true.

```sql run expect="0|1" title="Logic"
SELECT 1 AND 0, 1 OR 0;
```

`1 AND 0` is 0 and `1 OR 0` is 1, which prints as `0|1`.

### A closed range

`BETWEEN` includes both ends of the span.

```sql run expect="1" title="Both endpoints count"
SELECT 3 BETWEEN 1 AND 3;
```

The value 3 sits on the upper end, so `BETWEEN` returns `1`.
