---
language: php
chapter: 24
title: "PHP Multidimensional Arrays"
level: beginner
minutes: 8
goals:
  - "Read a cell with two indexes"
  - "Read one field from a row"
  - "Count the rows"
sources:
  - php-manual
updated: "2026-10-16"
---

Each row is itself an array. An outer array holds those rows in order.

### One cell

Row 1, column 0 contains `笔`.

```php run expect="笔" title="The second row"
<?php
$rows = [["茶", 18], ["笔", 3]];
echo $rows[1][0], "\n";
```

That cell prints `笔`.

### The price on a row

Row 0, column 1 contains the number 18.

```php run expect="18" title="Price on the first row"
<?php
$rows = [["茶", 18], ["笔", 3]];
echo $rows[0][1], "\n";
```

The price cell prints `18`.

### How many rows

`count` on the outer array is the number of rows.

```php run expect="2" title="Two rows"
<?php
$rows = [["茶", 18], ["笔", 3]];
echo count($rows), "\n";
```

The table has `2` rows.
