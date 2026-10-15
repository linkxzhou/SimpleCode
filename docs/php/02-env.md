---
language: php
chapter: 2
title: "PHP 安装"
level: beginner
minutes: 8
goals:
  - "知道按钮会执行 php -q"
  - "不把安装命令写进源码"
  - "不依赖 php -v 的版本文字"
sources:
  - php-manual
updated: "2026-10-15"
---

运行按钮已经带好解释器。源码里只放 PHP 语句。

### 能跑的文件

有 `<?php` 和一条 `echo` 就够这一页核对。

```php run expect="已就绪" title="就绪"
<?php
echo "已就绪\n";
```

输出里能看到 `已就绪`。

### 警告不要留着

用到的变量都先赋值，避免未定义名字。

```php run expect="笔" title="有初值"
<?php
$item = "笔";
echo $item, "\n";
```

输出里能看到 `笔`。

### 安装命令不是源码

`apt` 那一行是终端命令，放进 `.php` 不会去安装软件。

```php norun title="不是 PHP"
sudo apt install php-cli
```
