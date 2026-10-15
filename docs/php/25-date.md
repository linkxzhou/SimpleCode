---
language: php
chapter: 25
title: "PHP 日期"
level: beginner
minutes: 8
goals:
  - "用 gmdate 固定在 UTC"
  - "不依赖当前时区"
  - "用时间戳算出下一年"
sources:
  - php-manual
updated: "2026-10-15"
---

当前时间每次运行都不同。例子用时间戳 0。

### 纪元日

时间戳 0 在 UTC 是 1970-01-01。

```php run expect="1970-01-01" title="固定日期"
<?php
echo gmdate("Y-m-d", 0), "\n";
```

输出里能看到 `1970-01-01`。

### 小时

再过 3600 秒，UTC 的钟点是 01:00。

```php run expect="01:00" title="一小时后"
<?php
echo gmdate("H:i", 3600), "\n";
```

输出里能看到 `01:00`。

### 年份加一

从纪元那一年加一，得到 1971。

```php run expect="1971" title="下一年"
<?php
$year = (int) gmdate("Y", 0);
echo $year + 1, "\n";
```

输出里能看到 `1971`。
