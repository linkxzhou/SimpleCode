---
language: php
chapter: 28
title: "PHP Cookies"
level: beginner
minutes: 8
goals:
  - "Leave browser cookies off this page"
  - "Remember one value in an array"
  - "Supply a default when the key is missing"
sources:
  - php-manual
updated: "2026-10-16"
---

`setcookie` needs a real HTTP response. An array stores the value these pages would have remembered. Session headers and mail are omitted too.

### Leave setcookie idle

This run has no response headers that could carry a cookie.

```php norun title="No response"
<?php
setcookie("item", "笔");
echo "sent\n";
```

### A value stored in an array

The name to remember is stored under the key `item`.

```php run expect="笔" title="Remember the pen"
<?php
$cookie = ["item" => "笔"];
echo $cookie["item"], "\n";
```

The stored name is `笔`.

### A missing cookie entry

A missing key selects `无` through `??`. The value comes from that expression.

```php run expect="无" title="Nothing stored"
<?php
$cookie = [];
echo $cookie["item"] ?? "无", "\n";
```

The absent entry prints `无`.
