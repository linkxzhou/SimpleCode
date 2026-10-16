---
language: php
chapter: 30
title: "PHP Exceptions"
level: beginner
minutes: 8
goals:
  - "Throw an exception of your own"
  - "Catch that exception"
  - "Return normally when the value is valid"
sources:
  - php-manual
updated: "2026-10-16"
---

Throwing stops the current call. The caller chooses the text that reaches the output.

### A rejected price

Calling `require_price(0)` throws `BadPrice`. The `catch` block writes `denied`.

```php run expect="denied" title="Catch the exception"
<?php
class BadPrice extends Exception {}
function require_price($n) {
    if ($n <= 0) {
        throw new BadPrice("denied");
    }
    return $n;
}
try {
    echo require_price(0), "\n";
} catch (BadPrice $e) {
    echo "denied\n";
}
```

The caught result is `denied`.

### An accepted price

A positive argument returns from the `try` block, so `catch` is skipped.

```php run expect="18" title="Nothing thrown"
<?php
class LowPrice extends Exception {}
function keep_price($n) {
    if ($n <= 0) {
        throw new LowPrice("denied");
    }
    return $n;
}
try {
    echo keep_price(18), "\n";
} catch (LowPrice $e) {
    echo "denied\n";
}
```

The returned price is `18`.

### Read the exception message

`getMessage` returns the text stored on the exception object.

```php run expect="stop" title="The message"
<?php
class StopHere extends Exception {}
try {
    throw new StopHere("stop");
} catch (StopHere $e) {
    echo $e->getMessage(), "\n";
}
```

The message text is `stop`.
