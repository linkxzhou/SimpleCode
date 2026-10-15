---
language: php
chapter: 11
title: "PHP 运算符"
level: beginner
minutes: 8
goals:
  - "区分整数除法和小数除法"
  - "用余数"
  - "用 ?? 给空值一个备用"
sources:
  - php-manual
updated: "2026-10-15"
---

PHP 里 `7 / 2` 得到 3.5。要丢掉小数就用 `intdiv`。

### 除法

`/` 得到小数，`intdiv` 得到整数商。

```php run expect="3.5" title="先是小数"
<?php
echo 7 / 2, "\n";
echo intdiv(7, 2), "\n";
```

输出里能看到 `3.5`。

### 余数

7 除以 2 的余数是 1。

```php run expect="1" title="余数"
<?php
echo 7 % 2, "\n";
```

输出里能看到 `1`。

### 空值合并

`??` 在左边是 null 时改用右边。

```php run expect="匿名" title="没有名字"
<?php
$name = null;
echo $name ?? "匿名", "\n";
```

输出里能看到 `匿名`。
