---
language: php
chapter: 14
title: "PHP Arrays"
level: beginner
minutes: 8
goals:
  - "Read an element by index"
  - "Use a string as a key"
  - "Count elements with count"
sources:
  - php-manual
updated: "2026-10-16"
---

One PHP array can be ordered by numeric index. The same array can map string keys to values.

### An index

The second element is stored at index 1.

```php run expect="pen" title="The second item"
<?php
$items = ["tea", "pen", "ink"];
echo $items[1], "\n";
```

Index 1 reads `pen`.

### A string key

The key `name` stores a label. The key `price` stores the unit price.

```php run expect="tea 18" title="Two fields"
<?php
$item = ["name" => "tea", "price" => 18];
echo $item["name"], " ", $item["price"], "\n";
```

The two fields print `tea 18`.

### How many elements

`count` returns the number of elements in the array.

```php run expect="2" title="Two items"
<?php
$items = ["tea", "pen"];
echo count($items), "\n";
```

This array reports `2`.
