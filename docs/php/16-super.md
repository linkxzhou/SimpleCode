---
language: php
chapter: 16
title: "PHP 超级全局变量"
level: beginner
minutes: 8
goals:
  - "知道网页里的 $_GET 这里不要读"
  - "用普通数组代替查询参数"
  - "用 ?? 处理缺少的键"
sources:
  - php-manual
updated: "2026-10-15"
---

这一份运行时不接网页请求。`$_GET` 和 `$_POST` 只留在不运行的例子里。

### 网页参数不运行

下面这行要有真正的请求才会有意义。

```php norun title="没有请求"
<?php
echo $_GET["item"], "\n";
```

### 普通数组

查询参数写成自己准备的数组。

```php run expect="pen" title="自己准备"
<?php
$query = ["item" => "pen"];
echo $query["item"], "\n";
```

输出里能看到 `pen`。

### 缺少的键

没有这个键时，`??` 给出 none。

```php run expect="none" title="没有这项"
<?php
$query = [];
echo $query["item"] ?? "none", "\n";
```

输出里能看到 `none`。
