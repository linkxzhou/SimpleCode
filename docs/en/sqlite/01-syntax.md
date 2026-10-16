---
language: sqlite
chapter: 1
title: "SQL Syntax"
level: beginner
minutes: 8
goals:
  - "End a statement with a semicolon"
  - "Write keywords in either case"
  - "Quote text with single quotes"
sources:
  - sqlite-lang
updated: "2026-10-16"
---

A SQL statement ends with a semicolon. Text takes single quotes. Write a name bare, or wrap it in double quotes when the name needs quoting.

### The semicolon

The two statements run from top to bottom. The check reads the second result.

```sql run expect="2" title="The second statement"
SELECT 1;
SELECT 2;
```

The later `SELECT` returns `2`.

### Keyword case

SQLite still runs a keyword written entirely in lowercase.

```sql run expect="3" title="Lowercase keyword"
select 3;
```

`select 3` returns `3`.

### Single quotes mark text

In SQLite a double quote usually names an identifier. Put text in single quotes.

```sql run expect="water" title="Text"
SELECT 'water';
```

The quoted text comes back as `water`.
