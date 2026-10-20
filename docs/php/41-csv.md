---
language: php
chapter: 41
title: "PHP CSV 报表"
level: intermediate
minutes: 8
goals:
  - "用 str_getcsv 切开一行"
  - "跳过表头后把数量加起来"
  - "只统计 sku 为 tea 的数量"
sources:
  - php-manual
updated: "2026-10-20"
---

这里没有数据库，也没有上传的文件。报表行写在数组里，str_getcsv 按逗号切开。数量在第二列。

### 一行 tea,4 切出数量 4

str_getcsv 得到两个单元。下标 1 是数量 4。下标从 0 开始。

```php run expect="4" title="第二列是 4"
<?php
$cells = str_getcsv("tea,4");
echo $cells[1], "\n";
```

### 两行数量加起来是 5

第一行是表头，循环从下标 1 开始。tea 的 4 加上 cup 的 1，和是 5。

```php run expect="5" title="4 加 1"
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

### 只加 tea 得到 6

两行 tea 的数量是 4 和 2，cup 是 1。条件只留下 sku 等于 tea 的行，和是 6。

```php run expect="6" title="只要 tea"
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

### 空行数量按 0 计

第二列是空字符串时，(int) 把它变成 0。tea 的 3 加上 0，打印 3。

```php run expect="3" title="空列是 0"
<?php
$rows = ["tea,3", "cup,"];
$sum = 0;
foreach ($rows as $line) {
    $cells = str_getcsv($line);
    $sum += (int) ($cells[1] ?? "0");
}
echo $sum, "\n";
```
