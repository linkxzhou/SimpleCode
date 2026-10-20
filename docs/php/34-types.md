---
language: php
chapter: 34
title: "PHP 严格类型"
level: intermediate
minutes: 8
goals:
  - "在严格模式下把两个整数相加"
  - "拒绝把字符串传给整数参数"
  - "写出带返回类型的函数"
sources:
  - php-manual
updated: "2026-10-20"
---

declare(strict_types=1) 必须写在文件开头。严格模式下，整数参数不再自动收下数字字符串。类型错误用 TypeError 接住。

### 2 加 5 得到 7

add 的两个参数和返回值都声明为 int。传入 2 和 5，echo 打印 7。

```php run expect="7" title="严格相加"
<?php
declare(strict_types=1);
function add(int $a, int $b): int {
    return $a + $b;
}
echo add(2, 5), "\n";
```

### 字符串 2 被拒绝

严格模式下字符串 "2" 不能传给 int。TypeError 被接住后打印 bad，不再把字符串转成数字。

```php run expect="bad" title="拒绝字符串"
<?php
declare(strict_types=1);
function add(int $a, int $b): int {
    return $a + $b;
}
try {
    echo add("2", 5), "\n";
} catch (TypeError $e) {
    echo "bad\n";
}
```

### 返回类型把 4 留在 int 里

双倍函数声明返回 int。传入 2 得到 4。echo 和换行之间用逗号，中间没有多余空格。

```php run expect="4" title="两倍是 4"
<?php
declare(strict_types=1);
function twice(int $n): int {
    return $n * 2;
}
echo twice(2), "\n";
```

### 不写 strict_types 时的弱转换只供阅读

去掉严格声明后，"2" + 5 会按数字相加。那一行容易和严格模式的例子混在一起，所以只留在阅读块里。

```php norun title="弱转换不放进冒烟"
<?php
echo "2" + 5, "\n";
```
