---
language: sqlite
chapter: 8
title: "SQL AND and OR"
level: beginner
minutes: 8
goals:
  - "Narrow a filter with AND"
  - "Widen a filter with OR"
  - "Force evaluation order with parentheses"
sources:
  - sqlite-lang
updated: "2026-10-16"
---

`AND` binds more tightly than `OR`. Parentheses make an `OR` evaluate before a following `AND`.

### AND narrows the match

Both sides of `AND` have to hold.

```sql run expect="1" title="Both true"
SELECT 1 AND 1;
```

Each side is 1, so the conjunction is `1`.

### OR widens the match

One true side is enough for `OR`.

```sql run expect="2" title="Either name"
CREATE TABLE item (name TEXT);
INSERT INTO item VALUES ('tea'), ('water'), ('cup');
SELECT COUNT(*) FROM item WHERE name = 'tea' OR name = 'water';
```

Tea and water each satisfy one side, so the count is `2`. The cup matches neither name.

### Parentheses change the binding

Bare `AND` binds before `OR`. The parentheses here evaluate the `OR` first.

```sql run expect="1" title="OR first"
SELECT (0 OR 1) AND 1;
```

`(0 OR 1)` becomes 1, and combining that result with 1 still yields `1`.
