---
language: php
chapter: 4
title: "PHP Variables"
level: beginner
minutes: 8
goals:
  - "Name a variable with a dollar sign"
  - "Assign a new value to a variable"
  - "Keep a variable distinct from a quoted string"
sources:
  - php-manual
updated: "2026-10-16"
---

A variable name begins with `$`. PHP uses no separate keyword to declare it.

### Assignment

The number 18 is stored in `$price`, and the next statement prints it.

```php run expect="18" title="Unit price"
<?php
$price = 18;
echo $price, "\n";
```

`$price` prints `18`.

### A second assignment

The same name can receive a different number later in the file.

```php run expect="4" title="Changed to 4"
<?php
$n = 1;
$n = 4;
echo $n, "\n";
```

The later value is `4`.

### Quotes keep the characters

Single quotes store `$price` as characters. The output is those characters.

```php run expect="$price" title="A literal"
<?php
$price = 18;
echo '$price', "\n";
```

The quoted text is `$price`.
