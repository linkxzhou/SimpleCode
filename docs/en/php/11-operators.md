---
language: php
chapter: 11
title: "PHP Operators"
level: beginner
minutes: 8
goals:
  - "Divide with / and with intdiv"
  - "Take a remainder with %"
  - "Supply a fallback with ??"
sources:
  - php-manual
updated: "2026-10-16"
---

Dividing 7 by 2 with `/` yields 3.5. `intdiv` keeps only the integer quotient.

### Division

`/` produces a float. `intdiv` produces the whole-number quotient.

```php run expect="3.5" title="The float comes first"
<?php
echo 7 / 2, "\n";
echo intdiv(7, 2), "\n";
```

The first line is `3.5`.

### A remainder

The remainder of 7 divided by 2 is 1.

```php run expect="1" title="The remainder"
<?php
echo 7 % 2, "\n";
```

The `%` operator prints `1`.

### A null fallback

When the left operand is null, `??` selects the right operand.

```php run expect="anon" title="No name"
<?php
$name = null;
echo $name ?? "anon", "\n";
```

The fallback text is `anon`.
