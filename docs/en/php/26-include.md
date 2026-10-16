---
language: php
chapter: 26
title: "PHP Include"
level: beginner
minutes: 8
goals:
  - "Leave a second file unopened"
  - "Write the helper in the same file"
  - "Call the helper and check the result"
sources:
  - php-manual
updated: "2026-10-16"
---

Loading a second path with `include` is unreliable here. The helper is declared in the same file as the call.

### Leave include idle

The second file is absent, so this sample is not executed.

```php norun title="No second file"
<?php
include "tax.php";
echo tax(9), "\n";
```

### A helper in this file

`tax_of` multiplies by 2, and 9 times 2 is 18.

```php run expect="18" title="The same file"
<?php
function tax_of($n) {
    return $n * 2;
}
echo tax_of(9), "\n";
```

`tax_of` prints `18`.

### Call the helper again

`twice_price` doubles its argument, and 3 doubled is 6.

```php run expect="6" title="Another amount"
<?php
function twice_price($n) {
    return $n * 2;
}
echo twice_price(3), "\n";
```

`twice_price` prints `6`.
