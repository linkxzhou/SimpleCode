---
language: php
chapter: 39
title: "PHP 生成器"
level: intermediate
minutes: 8
goals:
  - "用 yield 依次交出 tea 和 cup"
  - "把交出的整数加起来"
  - "用 yield 的键表示序号"
sources:
  - php-manual
updated: "2026-10-20"
---

生成器函数遇到 yield 就暂停，并把一个值交给 foreach。函数不必先拼好整张数组。键可以在 yield 左边写明。

### 两次 yield 接成 teacup

pair 先交出 tea，再交出 cup。foreach 把它们接成 teacup。

```php run expect="teacup" title="接成 teacup"
<?php
function pair(): Generator {
    yield "tea";
    yield "cup";
}
$out = "";
foreach (pair() as $sku) {
    $out .= $sku;
}
echo $out, "\n";
```

### 1 和 4 相加是 5

生成器交出 1 和 4。循环把它们加进 $sum，打印 5。

```php run expect="5" title="和是 5"
<?php
function nums(): Generator {
    yield 1;
    yield 4;
}
$sum = 0;
foreach (nums() as $n) {
    $sum += $n;
}
echo $sum, "\n";
```

### 键 2 对上 mug

yield 2 => "mug" 把键写成 2。foreach 同时取出键和值，打印 2mug。逗号 echo 不会插入空格。

```php run expect="2mug" title="键和值"
<?php
function keyed(): Generator {
    yield 2 => "mug";
}
foreach (keyed() as $i => $sku) {
    echo $i, $sku, "\n";
}
```

### 空生成器的和是 0

yield 放在 if (false) 里，一次都不会执行。foreach 不进入循环，$sum 保持 0。带返回类型的生成器不能只写 return。

```php run expect="0" title="没有项"
<?php
function nothing(): Generator {
    if (false) {
        yield 0;
    }
}
$sum = 0;
foreach (nothing() as $n) {
    $sum += $n;
}
echo $sum, "\n";
```
