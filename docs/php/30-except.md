---
language: php
chapter: 30
title: "PHP 异常"
level: beginner
minutes: 8
goals:
  - "抛出自己的异常"
  - "用 catch 接住"
  - "成功时不进入 catch"
sources:
  - php-manual
updated: "2026-10-15"
---

异常用来打断这一次调用。调用方决定怎样报告。

### 拒绝

非正数抛出异常，捕获后打出 denied。

```php run expect="denied" title="接住异常"
<?php
class BadPrice extends Exception {}
function require_price($n) {
    if ($n <= 0) {
        throw new BadPrice("denied");
    }
    return $n;
}
try {
    echo require_price(0), "\n";
} catch (BadPrice $e) {
    echo "denied\n";
}
```

输出里能看到 `denied`。

### 通过

正数不会进入 catch。

```php run expect="18" title="没有抛出"
<?php
class LowPrice extends Exception {}
function keep_price($n) {
    if ($n <= 0) {
        throw new LowPrice("denied");
    }
    return $n;
}
try {
    echo keep_price(18), "\n";
} catch (LowPrice $e) {
    echo "denied\n";
}
```

输出里能看到 `18`。

### 消息

捕获后可以读异常自己的消息。

```php run expect="stop" title="消息"
<?php
class StopHere extends Exception {}
try {
    throw new StopHere("stop");
} catch (StopHere $e) {
    echo $e->getMessage(), "\n";
}
```

输出里能看到 `stop`。
