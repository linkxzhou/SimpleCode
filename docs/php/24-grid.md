---
language: php
chapter: 24
title: "PHP 多维数组"
level: beginner
minutes: 8
goals:
  - "用两层下标读取"
  - "取出一行"
  - "数一数有几行"
sources:
  - php-manual
updated: "2026-10-15"
---

一行是一个数组，外面再套一层数组。

### 某一格

第二行第一列是 pen。

```php run expect="pen" title="第二行"
<?php
$rows = [["tea", 18], ["pen", 3]];
echo $rows[1][0], "\n";
```

输出里能看到 `pen`。

### 整行的单价

第一行的第二格是 18。

```php run expect="18" title="第一行单价"
<?php
$rows = [["tea", 18], ["pen", 3]];
echo $rows[0][1], "\n";
```

输出里能看到 `18`。

### 行数

外层数组的长度就是行数。

```php run expect="2" title="两行"
<?php
$rows = [["tea", 18], ["pen", 3]];
echo count($rows), "\n";
```

输出里能看到 `2`。
