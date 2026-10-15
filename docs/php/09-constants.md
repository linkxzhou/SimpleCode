---
language: php
chapter: 9
title: "PHP 常量"
level: beginner
minutes: 8
goals:
  - "用 const 定义常量"
  - "用 define 定义常量"
  - "知道常量没有美元符号"
sources:
  - php-manual
updated: "2026-10-15"
---

常量一旦定义就不再赋值。名字前面不加 `$`。

### const

`RATE` 用来把 9 乘成 18。

```php run expect="18" title="倍率"
<?php
const RATE = 2;
echo 9 * RATE, "\n";
```

输出里能看到 `18`。

### define

`define` 适合在运行中给一个名字。

```php run expect="3" title="税率"
<?php
define("TAX", 3);
echo TAX, "\n";
```

输出里能看到 `3`。

### 不能改

计算时读取常量，不给它赋新值。

```php run expect="18" title="基数"
<?php
const BASE = 10;
echo BASE + 8, "\n";
```

输出里能看到 `18`。
