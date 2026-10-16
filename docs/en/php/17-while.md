---
language: php
chapter: 17
title: "PHP While Loop"
level: beginner
minutes: 8
goals:
  - "Accumulate a total with while"
  - "Update the condition inside the loop"
  - "Leave the loop early with break"
sources:
  - php-manual
updated: "2026-10-16"
---

`while` tests its condition before the body. A false condition ends the loop.

### A running total

The body adds 3, then 2, then 1. The total of those passes is 6.

```php run expect="6" title="The sum"
<?php
$n = 3;
$sum = 0;
while ($n > 0) {
    $sum += $n;
    $n -= 1;
}
echo $sum, "\n";
```

The accumulated total is `6`.

### A counter in the body

Each pass increments `$seen` and decrements `$left`. Two passes leave the counter at 2.

```php run expect="2" title="Two passes"
<?php
$left = 2;
$seen = 0;
while ($left > 0) {
    $seen += 1;
    $left -= 1;
}
echo $seen, "\n";
```

The counter prints `2`.

### Stop with break

When `$i` reaches 3 the loop breaks before adding that value. The total is 1 plus 2.

```php run expect="3" title="Stop before 3"
<?php
$i = 1;
$sum = 0;
while ($i <= 5) {
    if ($i === 3) {
        break;
    }
    $sum += $i;
    $i += 1;
}
echo $sum, "\n";
```

The partial total is `3`.
