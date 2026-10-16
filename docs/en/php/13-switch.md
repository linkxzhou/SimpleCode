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

A code of 2 selects the branch that writes `乙`.

```php run expect="乙" title="The second branch"
<?php
$code = 2;
switch ($code) {
    case 1:
        echo "甲\n";
        break;
    case 2:
        echo "乙\n";
        break;
    default:
        echo "其他\n";
}
```

That case prints `乙`.

### The default branch

A code with no matching `case` selects `default`.

```php run expect="其他" title="No match"
<?php
$code = 9;
switch ($code) {
    case 1:
        echo "甲\n";
        break;
    default:
        echo "其他\n";
}
```

The default text is `其他`.

### A string case

The value `"笔"` selects the case that holds the same characters.

```php run expect="3" title="The pen's unit price"
<?php
$item = "笔";
switch ($item) {
    case "茶":
        echo "18\n";
        break;
    case "笔":
        echo "3\n";
        break;
    default:
        echo "0\n";
}
```

The pen case prints `3`.
