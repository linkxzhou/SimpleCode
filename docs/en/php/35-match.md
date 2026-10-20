---
language: php
chapter: 35
title: "PHP match"
level: intermediate
minutes: 8
goals:
  - "Label 2 as cup with match"
  - "Catch an unknown number with default"
  - "Use a match result directly in addition"
sources:
  - php-manual
updated: "2026-10-20"
---

match picks a value with strict comparison and must produce a result. Branches are separated by commas, and default catches every other number. It does not fall through the way switch can.

### 2 maps to cup

label matches on an integer. 1 is tea and 2 is cup. Passing 2 makes echo print cup.

```php run expect="cup" title="2 is cup"
<?php
function label(int $n): string {
    return match ($n) {
        1 => "tea",
        2 => "cup",
        default => "none",
    };
}
echo label(2), "\n";
```

### 9 falls through to default

Neither 1 nor 2 equals 9, so default returns none. match does not continue into a later branch.

```php run expect="none" title="Other numbers are none"
<?php
function label(int $n): string {
    return match ($n) {
        1 => "tea",
        2 => "cup",
        default => "none",
    };
}
echo label(9), "\n";
```

### The branch value 4 plus 1

match returns 4 directly. The outer expression adds 1 and prints 5. The branch itself does not call echo.

```php run expect="5" title="4 plus 1"
<?php
function code(int $n): int {
    return match ($n) {
        1 => 4,
        default => 0,
    };
}
echo code(1) + 1, "\n";
```

### A match without default stays unread

A match with no default throws UnhandledMatchError when nothing matches. That line stays out of the smoke run.

```php norun title="Missing default"
<?php
echo match (3) {
    1 => "tea",
};
```
