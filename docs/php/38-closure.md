---
language: php
chapter: 38
title: "PHP 闭包"
level: intermediate
minutes: 8
goals:
  - "用 use 记住外层基数"
  - "用箭头函数自动捕获基数"
  - "把箭头函数套在数组的每一项上"
sources:
  - php-manual
updated: "2026-10-20"
---

普通闭包要用 use 带上外层变量。箭头函数 fn 会按值自动捕获外层变量，函数体只能是一个表达式。

### use 把 3 加 6 得到 9

闭包用 use ($base) 带走 3。调用时传入 6，打印 9。没有 use 的话，函数里看不见 $base。

```php run expect="9" title="3 加 6"
<?php
$base = 3;
$add = function (int $n) use ($base): int {
    return $n + $base;
};
echo $add(6), "\n";
```

### 箭头函数把 4 加 3 得到 7

fn($n) => $n + $base 自动捕获 $base。$base 是 3 时，传入 4 打印 7。

```php run expect="7" title="箭头加 3"
<?php
$base = 3;
$add = fn(int $n): int => $n + $base;
echo $add(4), "\n";
```

### 三项都乘 2 的和是 12

array_map 对 1、2、3 套用箭头函数。array_sum 得到 12。箭头函数体里只有乘法。

```php run expect="12" title="乘二再加"
<?php
$nums = array_map(fn(int $n): int => $n * 2, [1, 2, 3]);
echo array_sum($nums), "\n";
```

### 闭包不能改 use 进来的副本

use 按值复制 $base。闭包里把副本改成 9，外层的 $base 仍是 3。两段输出接在一起是 93。

```php run expect="93" title="外层仍是 3"
<?php
$base = 3;
$change = function () use ($base): int {
    $base = 9;
    return $base;
};
echo $change(), $base, "\n";
```
