---
language: php
chapter: 31
title: "PHP 过滤器"
level: beginner
minutes: 8
goals:
  - "用 filter_var 检查邮箱"
  - "拒绝不像邮箱的文字"
  - "用过滤器检查整数"
sources:
  - php-manual
updated: "2026-10-15"
---

`filter_var` 失败时返回 false。不要直接 echo false，它什么都不打。

### 邮箱通过

像邮箱的文字会原样返回。

```php run expect="ada@shop.test" title="通过"
<?php
echo filter_var("ada@shop.test", FILTER_VALIDATE_EMAIL), "\n";
```

输出里能看到 `ada@shop.test`。

### 邮箱拒绝

没有 @ 的文字得到 false，这里改打「拒绝」。

```php run expect="拒绝" title="不像邮箱"
<?php
$ok = filter_var("nope", FILTER_VALIDATE_EMAIL);
echo $ok === false ? "拒绝\n" : "通过\n";
```

输出里能看到 `拒绝`。

### 整数

`FILTER_VALIDATE_INT` 接受 `"18"`，返回整数 18。

```php run expect="18" title="是整数"
<?php
echo filter_var("18", FILTER_VALIDATE_INT), "\n";
```

输出里能看到 `18`。
