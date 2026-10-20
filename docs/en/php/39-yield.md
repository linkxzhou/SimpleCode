---
language: php
chapter: 39
title: "PHP generators"
level: intermediate
minutes: 8
goals:
  - "Yield tea and then cup"
  - "Add the integers a generator yields"
  - "Use the yield key as an index"
sources:
  - php-manual
updated: "2026-10-20"
---

A generator function pauses at yield and hands one value to foreach. It does not have to build the whole array first. A key can be written on the left of yield.

### Two yields join into teacup

pair yields tea and then cup. foreach joins them into teacup.

```php run expect="teacup" title="Join teacup"
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

### 1 and 4 add to 5

The generator yields 1 and 4. The loop adds them into $sum and prints 5.

```php run expect="5" title="Sum is 5"
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

### Key 2 points at mug

yield 2 => "mug" sets the key to 2. foreach takes both the key and the value and prints 2mug. echo with commas inserts no space.

```php run expect="2mug" title="Key and value"
<?php
function keyed(): Generator {
    yield 2 => "mug";
}
foreach (keyed() as $i => $sku) {
    echo $i, $sku, "\n";
}
```

### An empty generator sums to 0

The yield sits inside if (false), so it never runs. foreach does not enter, and $sum stays 0. A generator with a return type cannot use a bare return.

```php run expect="0" title="No items"
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
