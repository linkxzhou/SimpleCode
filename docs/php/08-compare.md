---
language: php
chapter: 8
title: "PHP 类型比较"
level: beginner
minutes: 8
goals:
  - "区分 == 和 ==="
  - "知道 0 和空字符串不相等"
  - "用 === 避免把数字当成文字"
sources:
  - php-manual
updated: "2026-10-15"
---

`==` 会在比较前转换类型。`===` 还要求类型相同。

### 宽松相等

数字 18 和字符串 `"18"` 用 `==` 算作相等。

```php run expect="相等" title="转换后相等"
<?php
echo 18 == "18" ? "相等\n" : "不同\n";
```

输出里能看到 `相等`。

### 严格相等

类型不同，`===` 不成立。

```php run expect="不同" title="类型不同"
<?php
echo 18 === "18" ? "相等\n" : "不同\n";
```

输出里能看到 `不同`。

### 零和空串

0 和空字符串用严格比较是不同的。

```php run expect="不同" title="不要混用"
<?php
echo 0 === "" ? "相等\n" : "不同\n";
```

输出里能看到 `不同`。
