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

代码 2 打出「乙」。

```php run expect="乙" title="第二支"
<?php
$code = 2;
switch ($code) {
    case 1:
        echo "甲\n";
        break;
    case 2:
        echo "乙\n";
        break;
    default:
        echo "其他\n";
}
```

输出里能看到 `乙`。

### 默认

没有匹配的 case 时走 default。

```php run expect="其他" title="没有匹配"
<?php
$code = 9;
switch ($code) {
    case 1:
        echo "甲\n";
        break;
    default:
        echo "其他\n";
}
```

输出里能看到 `其他`。

### 字符串分支

这里用严格先判断过的文字，再进入对应分支。

```php run expect="3" title="笔的单价"
<?php
$item = "笔";
switch ($item) {
    case "茶":
        echo "18\n";
        break;
    case "笔":
        echo "3\n";
        break;
    default:
        echo "0\n";
}
```

输出里能看到 `3`。
