---
language: php
chapter: 33
title: "PHP MySQL"
level: beginner
minutes: 8
goals:
  - "Treat mysqli as unavailable"
  - "Treat curl as unavailable"
  - "Represent one result row with an array"
sources:
  - php-manual
updated: "2026-10-16"
---

The database extension is not part of this build. An array stands in for a result row. Connection attempts stay in samples that are not run.

### Leave the connection idle

`mysqli_connect` is absent from this binary, so the sample is not executed.

```php norun title="No extension"
<?php
$link = mysqli_connect("localhost", "root", "", "shop");
echo $link ? "通\n" : "断\n";
```

### Both functions are absent

`function_exists` answers no for `mysqli_connect` and for `curl_init`.

```php run expect="没有 mysqli" title="Both are missing"
<?php
echo function_exists("mysqli_connect") ? "有\n" : "没有 mysqli\n";
echo function_exists("curl_init") ? "有\n" : "没有 curl\n";
```

The checks print `没有 mysqli` and `没有 curl`.

### A row kept in an array

With no database, one result row is an ordinary array of fields.

```php run expect="茶 18" title="One row"
<?php
$row = ["name" => "茶", "price" => 18];
echo $row["name"], " ", $row["price"], "\n";
```

The stand-in row prints `茶 18`.
