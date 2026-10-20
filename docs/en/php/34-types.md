---
language: php
chapter: 34
title: "PHP strict types"
level: intermediate
minutes: 8
goals:
  - "Add two integers in strict mode"
  - "Reject a string passed to an integer parameter"
  - "Write a function with a return type"
sources:
  - php-manual
updated: "2026-10-20"
---

declare(strict_types=1) has to be the first statement in the file. In strict mode an integer parameter no longer accepts a numeric string. The type error is caught as TypeError.

### 2 plus 5 is 7

Both parameters and the return value of add are declared int. Passing 2 and 5 makes echo print 7.

```php run expect="7" title="Strict sum"
<?php
declare(strict_types=1);
function add(int $a, int $b): int {
    return $a + $b;
}
echo add(2, 5), "\n";
```

### The string 2 is rejected

In strict mode the string "2" cannot be passed to int. The caught TypeError prints bad instead of converting the string.

```php run expect="bad" title="Reject a string"
<?php
declare(strict_types=1);
function add(int $a, int $b): int {
    return $a + $b;
}
try {
    echo add("2", 5), "\n";
} catch (TypeError $e) {
    echo "bad\n";
}
```

### The return type keeps 4 as int

The doubling function declares an int return. Passing 2 produces 4. echo and the newline are separated by a comma, so no extra space appears.

```php run expect="4" title="Twice is 4"
<?php
declare(strict_types=1);
function twice(int $n): int {
    return $n * 2;
}
echo twice(2), "\n";
```

### Weak conversion without strict_types stays unread

Without the strict declaration, "2" + 5 adds the values as numbers. That line is easy to confuse with the strict samples, so it stays in a reading block.

```php norun title="Weak conversion is not smoked"
<?php
echo "2" + 5, "\n";
```
