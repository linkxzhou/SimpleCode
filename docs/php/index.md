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

```php run expect="Hi" title="打招呼"
<?php
echo "Hi\n";
```

输出里能看到 `Hi`。

### 逗号不加空格

`echo` 可以接好几段，段与段之间不会自动插入空格。

```php run expect="tea18" title="连在一起"
<?php
echo "tea", 18, "\n";
```

输出里能看到 `tea18`。

### 读键盘留在阅读里

`fgets(STDIN)` 会因为常量未定义而停住。需要一行文字时，把那一行写在源码里。

```php norun title="读不到标准输入"
<?php
$line = fgets(STDIN);
echo $line;
```

### 第 34 章以后

严格模式把 2 和 5 加成 7，字符串参数打印 bad。match 把 2 标成 cup。枚举 Large 读名字，Many 的底值是 9。readonly 数量再赋值打印 locked。箭头函数捕获基数。生成器交出 tea 和 cup。trait 用 insteadof 选择。CSV 行用 str_getcsv 切开后只加 tea 的数量。
