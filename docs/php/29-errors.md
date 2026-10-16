---
language: php
chapter: 29
title: "PHP 错误"
level: beginner
minutes: 8
goals:
  - "接住除以零"
  - "用返回值表示解析失败"
  - "失败时不把结果当数字用"
sources:
  - php-manual
updated: "2026-10-15"
---

能接住的错误用 `try`。解析失败则返回 null，调用方先看再使用。

### 除以零

`intdiv(1, 0)` 会抛出 `DivisionByZeroError`。

```php run expect="failed" title="接住"
<?php
try {
    echo intdiv(1, 0), "\n";
} catch (DivisionByZeroError $e) {
    echo "failed\n";
}
```

输出里能看到 `failed`。

### 解析成功

全是数字才转成整数。

```php run expect="18" title="可以转换"
<?php
function read_price($text) {
    if (!ctype_digit($text)) {
        return null;
    }
    return (int) $text;
}
echo read_price("18"), "\n";
```

输出里能看到 `18`。

### 解析失败

含有字母时返回 null，打印 failed。

```php run expect="failed" title="不是数字"
<?php
function read_text_price($text) {
    if (!ctype_digit($text)) {
        return null;
    }
    return (int) $text;
}
echo read_text_price("no") === null ? "failed\n" : "success\n";
```

输出里能看到 `failed`。
