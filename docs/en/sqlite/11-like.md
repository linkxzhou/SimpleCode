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

The pattern `'茶%'` matches text that begins with 茶.

```sql run expect="1" title="Starts with tea"
CREATE TABLE item (name TEXT);
INSERT INTO item VALUES ('茶'), ('红茶');
SELECT COUNT(*) FROM item WHERE name LIKE '茶%';
```

红茶 begins with a different character, so the prefix match count is `1`.

### A match anywhere in the text

`'%茶%'` matches a name that contains 茶 in any position.

```sql run expect="红茶" title="Contains tea"
CREATE TABLE item (name TEXT);
INSERT INTO item VALUES ('红茶'), ('水');
SELECT name FROM item WHERE name LIKE '%茶%';
```

The name that contains 茶 is `红茶`.

### A single-character wildcard

`_` fills exactly one character position in the pattern.

```sql run expect="1" title="Two characters"
SELECT 'ab' LIKE 'a_';
```

`'ab'` has one character after `a`, so `LIKE` returns `1`.
