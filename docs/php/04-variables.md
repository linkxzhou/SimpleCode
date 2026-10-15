---
language: php
chapter: 4
title: "PHP 变量"
level: beginner
minutes: 8
goals:
  - "用美元符号声明名字"
  - "给变量一个新值"
  - "区分变量和字符串"
sources:
  - php-manual
updated: "2026-10-15"
---

变量名以 `$` 开头。没有声明关键字。

### 赋值

先把 18 放进 `$price`，再把它打出来。

```php run expect="18" title="单价"
<?php
$price = 18;
echo $price, "\n";
```

输出里能看到 `18`。

### 再改一次

同一个名字可以换成新的数。

```php run expect="4" title="改成 4"
<?php
$n = 1;
$n = 4;
echo $n, "\n";
```

输出里能看到 `4`。

### 名字不是字符串

有美元符号才是变量。引号里的 `$price` 不会去取值。

```php run expect="$price" title="字面量"
<?php
$price = 18;
echo '$price', "\n";
```

输出里能看到 `$price`。
