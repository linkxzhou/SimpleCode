---
language: php
chapter: 26
title: "PHP 包含"
level: beginner
minutes: 8
goals:
  - "知道这里不能再打开第二个文件"
  - "把函数写在同一个文件"
  - "调用这个函数核对结果"
sources:
  - php-manual
updated: "2026-10-15"
---

`include` 另一个路径在这个运行时里没有保证。函数直接写在当前文件。

### include 不运行

第二个文件并不存在于这次运行。

```php norun title="没有第二个文件"
<?php
include "tax.php";
echo tax(9), "\n";
```

### 同一文件的函数

倍率写在这个文件里，9 乘 2 得到 18。

```php run expect="18" title="同一文件"
<?php
function tax_of($n) {
    return $n * 2;
}
echo tax_of(9), "\n";
```

输出里能看到 `18`。

### 再调用一次

同一个函数可以套在另一笔金额上。

```php run expect="6" title="另一笔"
<?php
function twice_price($n) {
    return $n * 2;
}
echo twice_price(3), "\n";
```

输出里能看到 `6`。
