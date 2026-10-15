---
language: php
chapter: 6
title: "PHP heredoc"
level: beginner
minutes: 8
goals:
  - "用 heredoc 写多行文字"
  - "让变量在 heredoc 里展开"
  - "用 nowdoc 保持美元符号"
sources:
  - php-manual
updated: "2026-10-15"
---

结束标记要单独占一行，并且顶在行首。

### 多行

两行文字都留在字符串里。

```php run expect="甲" title="第一行还在"
<?php
$text = <<<TXT
甲
乙
TXT;
echo $text, "\n";
```

输出里能看到 `甲`。

### 展开变量

没有引号的结束标记会把 `$name` 换成值。

```php run expect="名称：茶" title="换成茶"
<?php
$name = "茶";
$text = <<<TXT
名称：$name
TXT;
echo $text, "\n";
```

输出里能看到 `名称：茶`。

### nowdoc

结束标记加了单引号，`$name` 就保持原样。

```php run expect="$name" title="不展开"
<?php
$name = "茶";
$text = <<<'TXT'
$name
TXT;
echo $text, "\n";
```

输出里能看到 `$name`。
