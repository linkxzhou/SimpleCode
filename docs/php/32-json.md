---
language: php
chapter: 32
title: "PHP JSON"
level: beginner
minutes: 8
goals:
  - "用 json_encode 打出对象"
  - "保留汉字"
  - "用 json_decode 读回字段"
sources:
  - php-manual
updated: "2026-10-15"
---

默认编码会把汉字写成转义序列。加上 `JSON_UNESCAPED_UNICODE` 才能看见汉字。

### 编码

键和值都留在一对花括号里。

```php run expect="{\"物\":\"茶\"}" title="一对字段"
<?php
echo json_encode(["物" => "茶"], JSON_UNESCAPED_UNICODE), "\n";
```

输出里能看到 `{"物":"茶"}`。

### 数字字段

单价是数字，不会带引号。

```php run expect="{\"price\":18}" title="数字"
<?php
echo json_encode(["price" => 18]), "\n";
```

输出里能看到 `{"price":18}`。

### 解码

`true` 让结果变成数组，才能用下标去读。

```php run expect="18" title="读回"
<?php
$data = json_decode('{"price":18}', true);
echo $data["price"], "\n";
```

输出里能看到 `18`。
