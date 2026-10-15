---
language: php
chapter: 18
title: "PHP For 循环"
level: beginner
minutes: 8
goals:
  - "用 for 从 1 加到 3"
  - "用下标走过数组"
  - "用 continue 跳过一项"
sources:
  - php-manual
updated: "2026-10-15"
---

`for` 把初值、条件和步进写在同一行。

### 求和

1 到 3 的和是 6。

```php run expect="6" title="求和"
<?php
$sum = 0;
for ($i = 1; $i <= 3; $i++) {
    $sum += $i;
}
echo $sum, "\n";
```

输出里能看到 `6`。

### 按下标走

第二项仍然是「笔」。

```php run expect="茶" title="第一项"
<?php
$items = ["茶", "笔", "墨"];
echo $items[0], "\n";
for ($i = 1; $i < count($items); $i++) {
    echo $items[$i], "\n";
}
```

输出里能看到 `茶`。

### continue

遇到 2 就跳过，所以只打出 1 和 3。

```php run expect="13" title="跳过 2"
<?php
$out = "";
for ($i = 1; $i <= 3; $i++) {
    if ($i === 2) {
        continue;
    }
    $out .= $i;
}
echo $out, "\n";
```

输出里能看到 `13`。
