---
language: php
chapter: 25
title: "PHP Dates"
level: beginner
minutes: 8
goals:
  - "Format a UTC date with gmdate"
  - "Ignore the machine time zone"
  - "Derive the next year from a timestamp"
sources:
  - php-manual
updated: "2026-10-16"
---

The clock differs on every run. The samples pass timestamp 0 into `gmdate`.

### The epoch date

In UTC, timestamp 0 falls on 1970-01-01.

```php run expect="1970-01-01" title="A fixed date"
<?php
echo gmdate("Y-m-d", 0), "\n";
```

`gmdate` formats `1970-01-01`.

### One hour past the epoch

Adding 3600 seconds reaches 01:00 on the UTC clock.

```php run expect="01:00" title="One hour later"
<?php
echo gmdate("H:i", 3600), "\n";
```

The clock text is `01:00`.

### The following year

The year at timestamp 0 is 1970. Adding 1 produces 1971.

```php run expect="1971" title="The next year"
<?php
$year = (int) gmdate("Y", 0);
echo $year + 1, "\n";
```

The computed year is `1971`.
