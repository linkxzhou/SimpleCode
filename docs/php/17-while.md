---
language: php
chapter: 17
title: "PHP While 循环"
level: beginner
minutes: 8
goals:
  - "用 while 累加"
  - "在循环里修改条件"
  - "用 break 提前停下"
sources:
  - php-manual
updated: "2026-10-15"
---

先看条件，再执行循环体。

### 累加

从 3 加到 1，和是 6。

```php run expect="6" title="和"
<?php
$n = 3;
$sum = 0;
while ($n > 0) {
    $sum += $n;
    $n -= 1;
}
echo $sum, "\n";
```

输出里能看到 `6`。

### 计数

循环两次，计数变成 2。

```php run expect="2" title="两次"
<?php
$left = 2;
$seen = 0;
while ($left > 0) {
    $seen += 1;
    $left -= 1;
}
echo $seen, "\n";
```

输出里能看到 `2`。

### break

加到 3 就停，所以和不是 1 到 5 的全部。

```php run expect="3" title="停在 3 之前"
<?php
$i = 1;
$sum = 0;
while ($i <= 5) {
    if ($i === 3) {
        break;
    }
    $sum += $i;
    $i += 1;
}
echo $sum, "\n";
```

输出里能看到 `3`。
