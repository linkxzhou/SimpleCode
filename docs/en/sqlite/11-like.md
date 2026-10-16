---
language: sqlite
chapter: 11
title: "SQL LIKE"
level: beginner
minutes: 8
goals:
  - "Match a span with the percent sign"
  - "Match one character with an underscore"
  - "Note the default case rule for LIKE"
sources:
  - sqlite-lang
updated: "2026-10-16"
---

`LIKE` matches a simple pattern. `%` covers a run of any length, and `_` covers one character. For ASCII letters, the default match ignores case.

### A prefix pattern

The pattern `'tea%'` matches text that begins with tea.

```sql run expect="1" title="Starts with tea"
CREATE TABLE item (name TEXT);
INSERT INTO item VALUES ('tea'), ('redtea');
SELECT COUNT(*) FROM item WHERE name LIKE 'tea%';
```

redtea begins with a different character, so the prefix match count is `1`.

### A match anywhere in the text

`'%tea%'` matches a name that contains tea in any position.

```sql run expect="redtea" title="Contains tea"
CREATE TABLE item (name TEXT);
INSERT INTO item VALUES ('redtea'), ('water');
SELECT name FROM item WHERE name LIKE '%tea%';
```

The name that contains tea is `redtea`.

### A single-character wildcard

`_` fills exactly one character position in the pattern.

```sql run expect="1" title="Two characters"
SELECT 'ab' LIKE 'a_';
```

`'ab'` has one character after `a`, so `LIKE` returns `1`.
