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

```php run expect="笔" title="The second item"
<?php
$items = ["茶", "笔", "墨"];
echo $items[1], "\n";
```

Index 1 reads `笔`.

### A string key

The key `name` stores a label. The key `price` stores the unit price.

```php run expect="茶 18" title="Two fields"
<?php
$item = ["name" => "茶", "price" => 18];
echo $item["name"], " ", $item["price"], "\n";
```

The two fields print `茶 18`.

### How many elements

`count` returns the number of elements in the array.

```php run expect="2" title="Two items"
<?php
$items = ["茶", "笔"];
echo count($items), "\n";
```

This array reports `2`.
