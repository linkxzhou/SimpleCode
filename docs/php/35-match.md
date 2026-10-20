---
language: php
chapter: 35
title: "PHP match"
level: intermediate
minutes: 8
goals:
  - "用 match 把 2 标成 cup"
  - "用 default 接住不认识的数字"
  - "让 match 的结果直接参加加法"
sources:
  - php-manual
updated: "2026-10-20"
---

match 用严格比较选择一个值，并且必须有结果。每个分支用逗号分隔，default 接住其余数字。它不是 switch，不会贯穿到下一支。

### 2 对应 cup

label 用 match 看整数。1 是 tea，2 是 cup。传入 2 时 echo 打印 cup。

```php run expect="cup" title="2 是 cup"
<?php
function label(int $n): string {
    return match ($n) {
        1 => "tea",
        2 => "cup",
        default => "none",
    };
}
echo label(2), "\n";
```

### 9 落到 default

1 和 2 都对不上 9。default 返回 none。match 不会继续执行后面并不存在的分支。

```php run expect="none" title="其余是 none"
<?php
function label(int $n): string {
    return match ($n) {
        1 => "tea",
        2 => "cup",
        default => "none",
    };
}
echo label(9), "\n";
```

### 分支给出的 4 再加 1

match 直接返回 4。外层加上 1，打印 5。分支本身不写 echo。

```php run expect="5" title="4 再加 1"
<?php
function code(int $n): int {
    return match ($n) {
        1 => 4,
        default => 0,
    };
}
echo code(1) + 1, "\n";
```

### 没有 default 且对不上的写法只供阅读

如果没有 default 又对不上任何分支，match 会抛 UnhandledMatchError。那一行不放进冒烟。

```php norun title="缺少 default"
<?php
echo match (3) {
    1 => "tea",
};
```
