---
language: php
chapter: 14
title: "PHP 数组"
level: beginner
minutes: 8
goals:
  - "用下标读取"
  - "用字符串当键"
  - "用 count 看元素个数"
sources:
  - php-manual
updated: "2026-10-15"
---

PHP 的数组既能按下标排，也能当映射用。

### 下标

第二项的下标是 1。

```php run expect="笔" title="第二项"
<?php
$items = ["茶", "笔", "墨"];
echo $items[1], "\n";
```

输出里能看到 `笔`。

### 字符串键

键是名字，值是单价。

```php run expect="茶 18" title="两个字段"
<?php
$item = ["name" => "茶", "price" => 18];
echo $item["name"], " ", $item["price"], "\n";
```

输出里能看到 `茶 18`。

### 个数

`count` 统计有几项。

```php run expect="2" title="两项"
<?php
$items = ["茶", "笔"];
echo count($items), "\n";
```

输出里能看到 `2`。
