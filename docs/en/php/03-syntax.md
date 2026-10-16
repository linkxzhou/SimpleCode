---
language: php
chapter: 3
title: "PHP Syntax"
level: beginner
minutes: 8
goals:
  - "End each statement with a semicolon"
  - "Group statements with braces"
  - "Silence a line with a comment"
sources:
  - php-manual
updated: "2026-10-16"
---

A semicolon finishes a statement. Braces gather statements into a block.

### Semicolons

Each `echo` is its own statement, so each one ends with a semicolon.

```php run expect="first" title="The first line"
<?php
echo "first\n";
echo "second\n";
```

The first statement prints `first`.

### A brace block

The assignment inside the braces updates `$n` for the `echo` that follows the block.

```php run expect="2" title="Changed in the block"
<?php
$n = 1;
{
    $n = 2;
}
echo $n, "\n";
```

After the braces, the value is `2`.

### Comments

A `//` comment runs to the end of its line, so the `echo` on that line is skipped.

```php run expect="kept" title="Skip the comment"
<?php
// echo "hidden\n";
echo "kept\n";
```

The active statement prints `kept`.
