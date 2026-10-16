---
language: php
chapter: 15
title: "PHP Array Sorting"
level: beginner
minutes: 8
goals:
  - "Sort values ascending with sort"
  - "Sort values descending with rsort"
  - "Keep keys while sorting with asort"
sources:
  - php-manual
updated: "2026-10-16"
---

`sort` rebuilds numeric indexes from zero. `asort` leaves string keys where they are.

### Ascending order

After `sort`, the first element is 2 and the last element is 8.

```php run expect="2 8" title="Ascending"
<?php
$nums = [8, 2, 5];
sort($nums);
echo $nums[0], " ", $nums[2], "\n";
```

The ends of the list are `2 8`.

### Descending order

After `rsort`, the first element is 8.

```php run expect="8" title="Descending"
<?php
$nums = [8, 2, 5];
rsort($nums);
echo $nums[0], "\n";
```

The leading value is `8`.

### Keys that stay put

`asort` orders the array by value. The smallest value still carries the key `b`.

```php run expect="b" title="The key remains"
<?php
$item = ["b" => 2, "a" => 8];
asort($item);
echo array_key_first($item), "\n";
```

`array_key_first` returns `b`.
