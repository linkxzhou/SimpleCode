---
language: php
chapter: 13
title: "PHP Switch"
level: beginner
minutes: 8
goals:
  - "按整数选择分支"
  - "每个分支都 break"
  - "用 default 接住其余情况"
sources:
  - php-manual
updated: "2026-10-15"
---

`switch` 用宽松比较。每个分支写上 `break`，避免掉进下一支。

### 第二支

代码 2 打出 second。

```php run expect="second" title="第二支"
<?php
$code = 2;
switch ($code) {
    case 1:
        echo "first\n";
        break;
    case 2:
        echo "second\n";
        break;
    default:
        echo "other\n";
}
```

输出里能看到 `second`。

### 默认

没有匹配的 case 时走 default。

```php run expect="other" title="没有匹配"
<?php
$code = 9;
switch ($code) {
    case 1:
        echo "first\n";
        break;
    default:
        echo "other\n";
}
```

输出里能看到 `other`。

### 字符串分支

这里用严格先判断过的文字，再进入对应分支。

```php run expect="3" title="笔的单价"
<?php
$item = "pen";
switch ($item) {
    case "tea":
        echo "18\n";
        break;
    case "pen":
        echo "3\n";
        break;
    default:
        echo "0\n";
}
```

输出里能看到 `3`。
