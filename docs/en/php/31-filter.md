---
language: php
chapter: 31
title: "PHP Filters"
level: beginner
minutes: 8
goals:
  - "Validate an email with filter_var"
  - "Reject text that is not an email"
  - "Validate an integer with a filter"
sources:
  - php-manual
updated: "2026-10-16"
---

`filter_var` returns false when a check fails. Printing that false value produces empty text, so test it before you print it.

### An email that passes

A string shaped like an email is returned unchanged.

```php run expect="ada@shop.test" title="Accepted"
<?php
echo filter_var("ada@shop.test", FILTER_VALIDATE_EMAIL), "\n";
```

The address comes back as `ada@shop.test`.

### An email that fails

A string with no `@` makes `FILTER_VALIDATE_EMAIL` return false. The script then writes `denied`.

```php run expect="denied" title="Not an email"
<?php
$ok = filter_var("nope", FILTER_VALIDATE_EMAIL);
echo $ok === false ? "denied\n" : "clear\n";
```

The failed check prints `denied`.

### An integer filter

`FILTER_VALIDATE_INT` accepts `"18"` and returns the integer 18.

```php run expect="18" title="An integer"
<?php
echo filter_var("18", FILTER_VALIDATE_INT), "\n";
```

The validated integer is `18`.
