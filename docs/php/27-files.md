---
language: php
chapter: 27
title: "PHP 文件"
level: beginner
minutes: 8
goals:
  - "知道这里不读磁盘路径"
  - "用 explode 拆开一行"
  - "用换行拆开多行文字"
sources:
  - php-manual
updated: "2026-10-15"
---

本机可以用 `file_get_contents` 读路径。这个运行时不依赖你的磁盘。

### 读路径不运行

真实文件这里没有保证。

```php norun title="不读磁盘"
<?php
echo file_get_contents("note.txt");
```

### 拆开一行

空格两边是名字和单价。

```php run expect="tea 18" title="两个字段"
<?php
$parts = explode(" ", "tea 18");
echo $parts[0], " ", $parts[1], "\n";
```

输出里能看到 `tea 18`。

### 拆开多行

两行文字用换行分开，行数是 2。

```php run expect="2" title="两行"
<?php
$lines = explode("\n", "tea\npen");
echo count($lines), "\n";
```

输出里能看到 `2`。
