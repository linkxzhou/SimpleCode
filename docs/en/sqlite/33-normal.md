---
language: sqlite
chapter: 33
title: "SQLite splitting tables"
level: advanced
minutes: 10
goals:
  - "Move a repeated publisher name out of the book rows"
  - "Join the name back for a query"
  - "Rename the publisher in one place"
sources:
  - sqlite-lang
  - quick-sql
updated: "2026-10-20"
---

If every book row repeats the publisher name, a rename touches many rows. Split the publisher into its own table and keep only an id on the book. Join them back when querying. This is a small example of storing a fact once. It does not walk through every normal form.

### The name is repeated on each row

Both books in `flat` say `north`. Counting that name returns 2. A rename would edit two rows, which is why the next section splits the table.

```sql run expect="2" title="Name repeated twice"
CREATE TABLE flat (title TEXT, publisher TEXT);
INSERT INTO flat VALUES ('atlas', 'north'), ('kettle', 'north');
SELECT COUNT(*) FROM flat WHERE publisher = 'north';
```

`north` appears 2 times.

### Two tables

`publisher` has one row, `north`, with id 1. Both books point at that id. After the join, `atlas|north` is still visible.

```sql run expect="atlas|north" title="Join the name back"
CREATE TABLE publisher (id INT PRIMARY KEY, name TEXT);
CREATE TABLE book (id INT PRIMARY KEY, title TEXT, publisher_id INT);
INSERT INTO publisher VALUES (1, 'north');
INSERT INTO book VALUES (1, 'atlas', 1), (2, 'kettle', 1);
SELECT book.title, publisher.name
FROM book
JOIN publisher ON book.publisher_id = publisher.id
WHERE book.title = 'atlas';
```

The join result is `atlas|north`.

### Rename once

The publisher name becomes `south`. Both books would show the new name. This query asks only for `kettle` and gets `kettle|south`.

```sql run expect="kettle|south" title="One rename"
CREATE TABLE publisher (id INT PRIMARY KEY, name TEXT);
CREATE TABLE book (id INT PRIMARY KEY, title TEXT, publisher_id INT);
INSERT INTO publisher VALUES (1, 'north');
INSERT INTO book VALUES (1, 'atlas', 1), (2, 'kettle', 1);
UPDATE publisher SET name = 'south' WHERE id = 1;
SELECT book.title, publisher.name
FROM book
JOIN publisher ON book.publisher_id = publisher.id
WHERE book.title = 'kettle';
```

The kettle's publisher is now `south`.

### Exercise: a book with no publisher

`orbit` has a null `publisher_id`. After a left join the publisher name is null, and `WHERE publisher.name IS NULL` keeps that row. The title is `orbit`.

```sql run expect="orbit" title="No publisher yet"
CREATE TABLE publisher (id INT PRIMARY KEY, name TEXT);
CREATE TABLE book (id INT PRIMARY KEY, title TEXT, publisher_id INT);
INSERT INTO publisher VALUES (1, 'north');
INSERT INTO book VALUES (1, 'atlas', 1), (3, 'orbit', NULL);
SELECT book.title
FROM book
LEFT JOIN publisher ON book.publisher_id = publisher.id
WHERE publisher.name IS NULL;
```

The book without a publisher is `orbit`.
