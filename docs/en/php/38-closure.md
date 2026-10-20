---
language: php
chapter: 38
title: "PHP closures"
level: intermediate
minutes: 8
goals:
  - "Remember an outer base with use"
  - "Capture a base automatically with an arrow function"
  - "Run an arrow function over each array item"
sources:
  - php-manual
updated: "2026-10-20"
---

A normal closure must list outer variables with use. An arrow function fn captures them by value on its own, and its body is a single expression.

### use adds 3 and 6 to get 9

The closure takes 3 with use ($base). Calling it with 6 prints 9. Without use, $base would be invisible inside the function.

```php run expect="9" title="3 plus 6"
<?php
$base = 3;
$add = function (int $n) use ($base): int {
    return $n + $base;
};
echo $add(6), "\n";
```

### An arrow function adds 4 and 3 to get 7

fn($n) => $n + $base captures $base automatically. When $base is 3, passing 4 prints 7.

```php run expect="7" title="Arrow adds 3"
<?php
$base = 3;
$add = fn(int $n): int => $n + $base;
echo $add(4), "\n";
```

### Doubling three items sums to 12

array_map applies the arrow function to 1, 2, and 3. array_sum is 12. The arrow body is only the multiplication.

```php run expect="12" title="Double then sum"
<?php
$nums = array_map(fn(int $n): int => $n * 2, [1, 2, 3]);
echo array_sum($nums), "\n";
```

### A closure does not change the captured copy

use copies $base by value. The closure changes its copy to 9, and the outer $base stays 3. The two echoes join into 93.

```php run expect="93" title="Outer stays 3"
<?php
$base = 3;
$change = function () use ($base): int {
    $base = 9;
    return $base;
};
echo $change(), $base, "\n";
```
