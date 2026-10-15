---
language: php
chapter: 19
title: "PHP 函数"
level: beginner
minutes: 8
goals:
  - "写出带返回值的函数"
  - "给参数一个默认值"
  - "让函数返回算好的单价"
sources:
  - php-manual
updated: "2026-10-15"
---

函数把一段计算收成名字。

### 返回值

`add` 把两个参数加起来交回去。

```php run expect="18" title="相加"
<?php
function add($a, $b) {
    return $a + $b;
}
echo add(11, 7), "\n";
```

输出里能看到 `18`。

### 默认参数

省略第二个参数时，按 1 来加。

```php run expect="18" title="省略一个"
<?php
function add_one($a, $b = 1) {
    return $a + $b;
}
echo add_one(17), "\n";
```

输出里能看到 `18`。

### 传入数组

函数返回新的单价，不依赖全局变量。

```php run expect="18" title="减二"
<?php
function discounted($price) {
    return $price - 2;
}
echo discounted(20), "\n";
```

输出里能看到 `18`。
