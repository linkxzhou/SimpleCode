---
language: sqlite
chapter: 34
title: "SQLite a small lending desk"
level: intermediate
minutes: 11
goals:
  - "Find who borrowed one title"
  - "Count loans per person with a left join"
  - "List titles that are still on the shelf"
sources:
  - sqlite-lang
updated: "2026-10-20"
---

Three tables: books, members, and loans. A loan stores ids only. Every run creates the tables again. Nothing remains from a previous script. The titles are `atlas`, `kettle`, and `orbit`.

### Who borrowed atlas

bea's id is 2, and the loan points book 1 at her. Joining the three tables produces `bea|atlas`.

```sql run expect="bea|atlas" title="atlas is out"
CREATE TABLE book (id INT PRIMARY KEY, title TEXT);
CREATE TABLE member (id INT PRIMARY KEY, name TEXT);
CREATE TABLE loan (book_id INT, member_id INT);
INSERT INTO book VALUES (1, 'atlas'), (2, 'kettle'), (3, 'orbit');
INSERT INTO member VALUES (1, 'ada'), (2, 'bea');
INSERT INTO loan VALUES (1, 2);
SELECT member.name, book.title
FROM loan
JOIN member ON member.id = loan.member_id
JOIN book ON book.id = loan.book_id;
```

The loan line is `bea|atlas`.

### How many each person has

ada borrowed `orbit` and bea borrowed two titles. Grouping by member counts the loans, then the names are sorted. `ada|1` is the first line.

```sql run expect="ada|1" title="ada has one"
CREATE TABLE book (id INT PRIMARY KEY, title TEXT);
CREATE TABLE member (id INT PRIMARY KEY, name TEXT);
CREATE TABLE loan (book_id INT, member_id INT);
INSERT INTO book VALUES (1, 'atlas'), (2, 'kettle'), (3, 'orbit');
INSERT INTO member VALUES (1, 'ada'), (2, 'bea');
INSERT INTO loan VALUES (1, 2), (2, 2), (3, 1);
SELECT member.name, COUNT(loan.book_id)
FROM member
LEFT JOIN loan ON loan.member_id = member.id
GROUP BY member.id, member.name
ORDER BY member.name;
```

ada's count is 1, on the line `ada|1`.

### Still on the shelf

This time only atlas is on loan. `NOT IN` keeps kettle and orbit. Sorted by title, the lines are `kettle` and then `orbit`.

```sql run expect="kettle" title="kettle remains"
CREATE TABLE book (id INT PRIMARY KEY, title TEXT);
CREATE TABLE loan (book_id INT);
INSERT INTO book VALUES (1, 'atlas'), (2, 'kettle'), (3, 'orbit');
INSERT INTO loan VALUES (1);
SELECT title FROM book
WHERE id NOT IN (SELECT book_id FROM loan)
ORDER BY title;
```

Titles still on the shelf include `kettle`.

### Exercise: a window count of loans

A partitioned `COUNT` is attached to each of that member's rows. bea has two loan rows, so the window count is 2. After `DISTINCT` and a sort by name, the text includes `bea|2`.

```sql run expect="bea|2" title="Window count for bea"
CREATE TABLE member (id INT PRIMARY KEY, name TEXT);
CREATE TABLE loan (book_id INT, member_id INT);
INSERT INTO member VALUES (1, 'ada'), (2, 'bea');
INSERT INTO loan VALUES (1, 2), (2, 2), (3, 1);
SELECT DISTINCT member.name,
       COUNT(loan.book_id) OVER (PARTITION BY member.id) AS n
FROM member
JOIN loan ON loan.member_id = member.id
ORDER BY member.name;
```

bea's window count is 2.
