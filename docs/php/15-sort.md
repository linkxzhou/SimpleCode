---
language: php
chapter: 15
title: "PHP 数组排序"
level: beginner
minutes: 8
goals:
  - "用 sort 按值从小到大"
  - "用 rsort 从大到小"
  - "用 asort 排序时保留键"
sources:
  - php-manual
updated: "2026-10-15"
---

`sort` 会重排下标。要保住字符串键，用 `asort`。

### 从小到大

排完后第一项是 2，最后一项是 8。

```php run expect="2 8" title="升序"
<?php
$nums = [8, 2, 5];
sort($nums);
echo $nums[0], " ", $nums[2], "\n";
```

输出里能看到 `2 8`。

### 从大到小

`rsort` 之后第一项是 8。

```php run expect="8" title="降序"
<?php
$nums = [8, 2, 5];
rsort($nums);
echo $nums[0], "\n";
```

输出里能看到 `8`。

### 保住键

`asort` 按值排，最小的那项键还是 b。

```php run expect="b" title="键还在"
<?php
$item = ["b" => 2, "a" => 8];
asort($item);
echo array_key_first($item), "\n";
```

输出里能看到 `b`。
