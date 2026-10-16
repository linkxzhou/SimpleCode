---
language: php
chapter: 13
title: "PHP Switch"
level: beginner
minutes: 8
goals:
  - "Select a branch with an integer"
  - "End each branch with break"
  - "Catch other values with default"
sources:
  - php-manual
updated: "2026-10-16"
---

`switch` matches with loose comparison. A `break` at the end of a branch keeps the next branch from running.

### The second case

A code of 2 selects the branch that writes `second`.

```php run expect="second" title="The second branch"
<?php
$code = 2;
switch ($code) {
    case 1:
        echo "first\n";
        break;
    case 2:
        echo "second\n";
        break;
    default:
        echo "other\n";
}
```

That case prints `second`.

### The default branch

A code with no matching `case` selects `default`.

```php run expect="other" title="No match"
<?php
$code = 9;
switch ($code) {
    case 1:
        echo "first\n";
        break;
    default:
        echo "other\n";
}
```

The default text is `other`.

### A string case

The value `"pen"` selects the case that holds the same characters.

```php run expect="3" title="The pen's unit price"
<?php
$item = "pen";
switch ($item) {
    case "tea":
        echo "18\n";
        break;
    case "pen":
        echo "3\n";
        break;
    default:
        echo "0\n";
}
```

The pen case prints `3`.
