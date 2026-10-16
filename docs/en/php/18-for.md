---
language: php
chapter: 18
title: "PHP For Loop"
level: beginner
minutes: 8
goals:
  - "Add the numbers from 1 to 3 with for"
  - "Walk an array by index"
  - "Skip one value with continue"
sources:
  - php-manual
updated: "2026-10-16"
---

A `for` header stores the start value, the condition, and the step. The body repeats while the condition holds.

### A short sum

The integers from 1 through 3 add up to 6.

```php run expect="6" title="Sum the numbers"
<?php
$sum = 0;
for ($i = 1; $i <= 3; $i++) {
    $sum += $i;
}
echo $sum, "\n";
```

The loop total is `6`.

### Walk by index

The loop reads each later index in order. Index 1 still holds `pen`.

```php run expect="tea" title="The first item"
<?php
$items = ["tea", "pen", "ink"];
echo $items[0], "\n";
for ($i = 1; $i < count($items); $i++) {
    echo $items[$i], "\n";
}
```

The printed lines are `tea`, `pen`, and `ink`.

### Skip with continue

When `$i` equals 2, `continue` skips the rest of that pass. The collected digits are 1 and 3.

```php run expect="13" title="Skip 2"
<?php
$out = "";
for ($i = 1; $i <= 3; $i++) {
    if ($i === 2) {
        continue;
    }
    $out .= $i;
}
echo $out, "\n";
```

The collected text is `13`.
