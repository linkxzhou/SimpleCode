---
language: php
chapter: 41
title: "PHP CSV report"
level: intermediate
minutes: 8
goals:
  - "Split a line with str_getcsv"
  - "Sum quantities after the header"
  - "Sum only rows whose sku is tea"
sources:
  - php-manual
updated: "2026-10-20"
---

There is no database and no uploaded file. Report lines live in an array, and str_getcsv splits them on commas. The quantity is the second column.

### The line tea,4 yields quantity 4

str_getcsv returns two cells. Index 1 is the quantity 4. Indexes start at 0.

```php run expect="4" title="Second cell is 4"
<?php
$cells = str_getcsv("tea,4");
echo $cells[1], "\n";
```

### Two quantities add to 5

The first line is a header, so the loop starts at index 1. tea contributes 4 and cup contributes 1, and the sum is 5.

```php run expect="5" title="4 plus 1"
<?php
$rows = ["sku,qty", "tea,4", "cup,1"];
$sum = 0;
foreach ($rows as $i => $line) {
    if ($i === 0) {
        continue;
    }
    $cells = str_getcsv($line);
    $sum += (int) $cells[1];
}
echo $sum, "\n";
```

### Only tea adds to 6

The tea quantities are 4 and 2, and cup is 1. The condition keeps only rows whose sku is tea, so the sum is 6.

```php run expect="6" title="Tea only"
<?php
$rows = ["tea,4", "cup,1", "tea,2"];
$sum = 0;
foreach ($rows as $line) {
    $cells = str_getcsv($line);
    if ($cells[0] === "tea") {
        $sum += (int) $cells[1];
    }
}
echo $sum, "\n";
```

### An empty quantity counts as 0

When the second cell is an empty string, (int) turns it into 0. tea contributes 3, plus 0, and the line is 3.

```php run expect="3" title="Empty cell is 0"
<?php
$rows = ["tea,3", "cup,"];
$sum = 0;
foreach ($rows as $line) {
    $cells = str_getcsv($line);
    $sum += (int) ($cells[1] ?? "0");
}
echo $sum, "\n";
```
