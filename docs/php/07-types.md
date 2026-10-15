---
language: php
chapter: 7
title: "PHP 数据类型"
level: beginner
minutes: 8
goals:
  - "用 gettype 看整数和小数"
  - "知道 true 打印出来是 1"
  - "知道数组也是一种类型"
sources:
  - php-manual
updated: "2026-10-15"
---

常见的值有整数、小数、字符串、布尔和数组。

### 整数和小数

`gettype` 对 18 给出 integer，对 1.5 给出 double。

```php run expect="integer" title="整数在前"
<?php
echo gettype(18), "\n";
echo gettype(1.5), "\n";
```

输出里能看到 `integer`。

### 布尔

`true` 被 `echo` 打成 1，`false` 打成空。这里只打真。

```php run expect="1" title="真是 1"
<?php
echo true, "\n";
```

输出里能看到 `1`。

### 数组

数组的类型名就是 array。

```php run expect="array" title="数组类型"
<?php
echo gettype(["茶"]), "\n";
```

输出里能看到 `array`。
