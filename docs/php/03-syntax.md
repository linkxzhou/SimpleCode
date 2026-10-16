---
language: php
chapter: 3
title: "PHP 语法"
level: beginner
minutes: 8
goals:
  - "用分号结束语句"
  - "用花括号包住一块"
  - "用注释去掉不会执行的输出"
sources:
  - php-manual
updated: "2026-10-15"
---

语句以分号结束。花括号把几条语句收成一块。

### 分号

两条输出各写一行。

```php run expect="first" title="第一行"
<?php
echo "first\n";
echo "second\n";
```

输出里能看到 `first`。

### 块

块里的赋值只为了后面那条输出。

```php run expect="2" title="块里改过"
<?php
$n = 1;
{
    $n = 2;
}
echo $n, "\n";
```

输出里能看到 `2`。

### 注释

双斜线后面的输出不会执行。

```php run expect="kept" title="跳过注释"
<?php
// echo "隐藏\n";
echo "kept\n";
```

输出里能看到 `kept`。
