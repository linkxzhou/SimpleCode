---
language: php
chapter: 33
title: "PHP MySQL"
level: beginner
minutes: 8
goals:
  - "知道这里没有 mysqli"
  - "知道这里没有 curl"
  - "用数组代替一行查询结果"
sources:
  - php-manual
updated: "2026-10-15"
---

扩展没有装进这份运行时。查询结果用数组表示，连接函数只留在不运行的例子里。

### 连接不运行

`mysqli_connect` 不在这份二进制里。

```php norun title="没有扩展"
<?php
$link = mysqli_connect("localhost", "root", "", "shop");
echo $link ? "link\n" : "off\n";
```

### 扩展不存在

`function_exists` 对这两个名字都是否。

```php run expect="gone mysqli" title="两个都没有"
<?php
echo function_exists("mysqli_connect") ? "has\n" : "gone mysqli\n";
echo function_exists("curl_init") ? "has\n" : "gone curl\n";
```

输出里能看到 `gone mysqli`。

### 内存里的一行

没有数据库时，一行结果就是一个数组。

```php run expect="tea 18" title="一行"
<?php
$row = ["name" => "tea", "price" => 18];
echo $row["name"], " ", $row["price"], "\n";
```

输出里能看到 `tea 18`。
