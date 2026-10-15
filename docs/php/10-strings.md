---
language: php
chapter: 10
title: "PHP 字符串"
level: beginner
minutes: 8
goals:
  - "用点号拼接"
  - "知道 strlen 按字节计数"
  - "用 str_replace 替换一段"
sources:
  - php-manual
updated: "2026-10-15"
---

字符串按字节看长度。`你好` 的 `strlen` 是 6。

### 拼接

点号把两段收成一段，中间不会自动加空格。

```php run expect="buy pen" title="接上"
<?php
echo "buy" . " pen", "\n";
```

输出里能看到 `buy pen`。

### 字节长度

两个汉字在 UTF-8 里占 6 个字节。

```php run expect="6" title="六个字节"
<?php
echo strlen("你好"), "\n";
```

输出里能看到 `6`。

### 替换

`str_replace` 把「笔」换成「墨」。

```php run expect="买墨" title="换成墨"
<?php
echo str_replace("笔", "墨", "买笔"), "\n";
```

输出里能看到 `买墨`。
