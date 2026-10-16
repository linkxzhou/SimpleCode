---
language: php
chapter: 19
title: "PHP Functions"
level: beginner
minutes: 8
goals:
  - "Return a value from a function"
  - "Give a parameter a default"
  - "Return a computed price from a function"
sources:
  - php-manual
updated: "2026-10-16"
---

A function turns a calculation into a callable name. The caller can use the returned number.

### A returned sum

`add` adds its two parameters and returns the result to the caller.

```php run expect="18" title="Add the arguments"
<?php
function add($a, $b) {
    return $a + $b;
}
echo add(11, 7), "\n";
```

The call prints `18`.

### A default argument

Omitting the second parameter makes `add_one` use 1.

```php run expect="18" title="Omit one argument"
<?php
function add_one($a, $b = 1) {
    return $a + $b;
}
echo add_one(17), "\n";
```

17 plus that default prints `18`.

### Pass the price in

`discounted` subtracts 2 from the argument the caller passes in.

```php run expect="18" title="Subtract two"
<?php
function discounted($price) {
    return $price - 2;
}
echo discounted(20), "\n";
```

The discounted figure is `18`.
