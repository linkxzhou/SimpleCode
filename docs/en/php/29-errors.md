---
language: php
chapter: 29
title: "PHP Errors"
level: beginner
minutes: 8
goals:
  - "Catch division by zero"
  - "Report a bad parse with a return value"
  - "Check a failure before using it as a number"
sources:
  - php-manual
updated: "2026-10-16"
---

Thrown errors are handled with `try`. A parse that fails returns null, and the caller inspects that result before using it.

### Division by zero

`intdiv(1, 0)` throws `DivisionByZeroError`. The `catch` block writes the failure text.

```php run expect="failed" title="Caught"
<?php
try {
    echo intdiv(1, 0), "\n";
} catch (DivisionByZeroError $e) {
    echo "failed\n";
}
```

The handler prints `failed`.

### Digits become an integer

`ctype_digit` accepts an all-digit string, and the function casts it to int.

```php run expect="18" title="A valid conversion"
<?php
function read_price($text) {
    if (!ctype_digit($text)) {
        return null;
    }
    return (int) $text;
}
echo read_price("18"), "\n";
```

The parsed price is `18`.

### Letters stay rejected

A letter makes `ctype_digit` return false, so the function returns null. The caller writes `failed`.

```php run expect="failed" title="Not a number"
<?php
function read_text_price($text) {
    if (!ctype_digit($text)) {
        return null;
    }
    return (int) $text;
}
echo read_text_price("no") === null ? "failed\n" : "success\n";
```

The rejected parse prints `failed`.
