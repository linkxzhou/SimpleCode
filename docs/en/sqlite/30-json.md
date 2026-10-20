---
language: sqlite
chapter: 30
title: "SQLite JSON text"
level: advanced
minutes: 9
goals:
  - "See that this build has no JSON1"
  - "Split the fields into ordinary columns"
  - "Slice one fixed fragment with instr"
sources:
  - sqlite-lang
updated: "2026-10-20"
---

SQLite's JSON functions come from the optional JSON1 compile. This wasm build is 3.26 and has neither `json` nor `json_extract`. Calling them is an error. The stable approach is to store columns. String functions can only illustrate one frozen fragment. They are not a parser.

### The standard call stays unread

On a full SQLite build, `json_extract` would read `$.qty`. The button here does not run it. The official note is at https://www.sqlite.org/json1.html .

```sql norun title="No json_extract"
SELECT json_extract('{"sku":"tea","qty":2}', '$.qty');
```

This block stays unread so the script does not fail with "no such function".

### Split into columns

The same facts are columns `sku` and `qty`. Selecting the quantity returns 2. No braces are parsed.

```sql run expect="2" title="Quantity in a column"
CREATE TABLE item (sku TEXT, qty INT);
INSERT INTO item VALUES ('tea', 2);
SELECT qty FROM item WHERE sku = 'tea';
```

The quantity is 2.

### tea inside a fixed fragment

The document string is `{"sku":"tea"}`. `instr` finds `tea` and `substr` takes three characters. If the key changes, this slice is wrong. It fits only this literal.

```sql run expect="tea" title="Slice tea"
SELECT substr(doc, instr(doc, 'tea'), 3)
FROM (SELECT '{"sku":"tea"}' AS doc);
```

The slice is `tea`.

### Exercise: the digit after the colon

Another text is written as `tea:4`, with no braces. The character after the colon is `4`. This is still string slicing, not JSON.

```sql run expect="4" title="After the colon"
SELECT substr(doc, instr(doc, ':') + 1, 1)
FROM (SELECT 'tea:4' AS doc);
```

The character after the colon is `4`.
