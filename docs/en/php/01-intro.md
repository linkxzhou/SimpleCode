---
language: php
chapter: 1
title: "PHP Introduction"
level: beginner
minutes: 8
goals:
  - "Write a script that finishes in one run"
  - "Store a unit price in a variable"
  - "Store more than one name in an array"
sources:
  - php-manual
updated: "2026-10-16"
---

Each sample runs one PHP file from top to bottom and then stops. There is no form submission and no database handle.

### A single run

The interpreter walks the statements in order. After the result is written, the process ends.

```php run expect="start" title="Start"
<?php
echo "start\n";
```

The opening word is `start`.

### A unit price

A name that begins with `$` can hold a number. A later statement can print that number.

```php run expect="18" title="Unit price"
<?php
$price = 18;
echo $price, "\n";
```

The stored price shows `18`.

### Several names

Square brackets select an element by index. The first index is zero.

```php run expect="pen" title="The second item"
<?php
$names = ["tea", "pen"];
echo $names[1], "\n";
```

Index 1 holds `pen`.
