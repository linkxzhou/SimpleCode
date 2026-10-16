---
language: php
chapter: 28
title: "PHP Cookie"
level: beginner
minutes: 8
goals:
  - "知道这里没有浏览器保存 Cookie"
  - "用数组记住一项"
  - "缺少时给出默认"
sources:
  - php-manual
updated: "2026-10-15"
---

`setcookie` 需要真正的 HTTP 响应。这里用数组代替那一块记忆。会话和邮件同样不发送。

### setcookie 不运行

没有响应头可以带上 Cookie。

```php norun title="没有响应"
<?php
setcookie("item", "pen");
echo "sent\n";
```

### 数组里的一项

把要记住的名字放进数组。

```php run expect="pen" title="记住笔"
<?php
$cookie = ["item" => "pen"];
echo $cookie["item"], "\n";
```

输出里能看到 `pen`。

### 没有这项

键不存在时打印 none，而不是去读浏览器。

```php run expect="none" title="没有记下"
<?php
$cookie = [];
echo $cookie["item"] ?? "none", "\n";
```

输出里能看到 `none`。
