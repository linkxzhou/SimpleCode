---
language: php
chapter: 0
title: "PHP 教程"
minutes: 8
goals:
  - "用 echo 打出一行"
  - "知道文件以 <?php 开头"
  - "知道这里读不到标准输入"
sources:
  - php-manual
updated: "2026-10-15"
---

这一本用 `php -q` 执行单个文件。文件从 `<?php` 开始。`STDIN` 没有定义，例子不读键盘。

### 第一行

`echo` 把字符串送到输出，换行自己写。

```php run expect="你好" title="打招呼"
<?php
echo "你好\n";
```

输出里能看到 `你好`。

### 逗号不加空格

`echo` 可以接好几段，段与段之间不会自动插入空格。

```php run expect="茶18" title="连在一起"
<?php
echo "茶", 18, "\n";
```

输出里能看到 `茶18`。

### 读键盘留在阅读里

`fgets(STDIN)` 会因为常量未定义而停住。需要一行文字时，把那一行写在源码里。

```php norun title="读不到标准输入"
<?php
$line = fgets(STDIN);
echo $line;
```
