---
language: php
chapter: 23
title: "PHP 表单"
level: beginner
minutes: 8
goals:
  - "知道这里没有网页表单"
  - "用函数检查一段文字"
  - "空字符串算作缺少"
sources:
  - php-manual
updated: "2026-10-15"
---

没有浏览器把表单送进来。检查写成函数，输入是字符串。

### $_POST 不运行

这一行要有表单提交才有值。

```php norun title="没有表单"
<?php
echo $_POST["name"], "\n";
```

### 收到名字

去掉两端空白后，名字还在。

```php run expect="gotAda" title="去掉空白"
<?php
function accept_name($name) {
    $name = trim($name);
    if ($name === "") {
        return "missing";
    }
    return "got" . $name;
}
echo accept_name("  Ada"), "\n";
```

输出里能看到 `gotAda`。

### 空的提交

只剩空白时，返回 missing。

```php run expect="missing" title="全是空白"
<?php
function accept_blank($name) {
    $name = trim($name);
    if ($name === "") {
        return "missing";
    }
    return "got" . $name;
}
echo accept_blank("   "), "\n";
```

输出里能看到 `missing`。
