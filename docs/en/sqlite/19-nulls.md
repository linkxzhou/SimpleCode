---
language: sqlite
chapter: 19
title: "SQL NULL"
level: beginner
minutes: 8
goals:
  - "Test for null with IS NULL"
  - "Remember a comparison with null is not true"
  - "Substitute a default with COALESCE"
sources:
  - sqlite-lang
updated: "2026-10-16"
---

NULL means the cell has no value. Zero is a real number, and an empty string is real text.

### Test for null with IS NULL

Use `IS NULL` when you need a true-or-false answer about a missing value.

```sql run expect="1|" title="Only IS matches"
SELECT NULL IS NULL, NULL = NULL;
```

The first column is 1 and the equality column is blank, so the line is `1|`.

### A comparison with null stays null

`NULL > 0` is itself null. It is neither the number 0 nor the number 1. `typeof` shows the storage class.

```sql run expect="null" title="The comparison is null"
SELECT typeof(NULL > 0);
```

`typeof` reports `null` for that comparison.

### COALESCE fills in a default

`COALESCE` returns the first argument that holds a value.

```sql run expect="18" title="Default price"
SELECT COALESCE(NULL, 18);
```

The null argument is skipped, and the default that remains is `18`.
