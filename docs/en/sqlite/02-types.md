---
language: sqlite
chapter: 2
title: "SQL Data Types"
level: beginner
minutes: 8
goals:
  - "Separate integer, text, and null"
  - "Read a storage class with typeof"
  - "Keep integer division integral"
sources:
  - sqlite-lang
updated: "2026-10-16"
---

SQLite types behave more like storage classes than fixed column types. A column is allowed to mix values. These lessons still keep one kind of value in each column.

### typeof

An integer is stored with class integer. A quoted string is stored with class text.

```sql run expect="integer|text" title="Two classes"
SELECT typeof(3), typeof('tea');
```

`typeof` reports the pair `integer|text`.

### Integer division

Dividing two integers drops the fraction. The `%` operator keeps the remainder.

```sql run expect="3|2" title="Quotient and remainder"
SELECT 20 / 6, 20 % 6;
```

`20 / 6` is 3 and `20 % 6` is 2, so the row reads `3|2`.

### Division by zero yields null

`1 / 0` yields NULL. `IS NULL` turns that result into 1.

```sql run expect="1" title="Null"
SELECT 1 / 0 IS NULL;
```

`1 / 0 IS NULL` evaluates to `1`.
