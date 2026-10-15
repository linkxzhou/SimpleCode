---
language: php
chapter: 20
title: "PHP 魔术常量"
level: beginner
minutes: 8
goals:
  - "用 __LINE__ 看行号"
  - "用 __FUNCTION__ 看函数名"
  - "用 __CLASS__ 看类名"
sources:
  - php-manual
updated: "2026-10-15"
---

魔术常量由解释器填。不要用它们去读磁盘路径。

### 行号

这条 `echo` 写在第 2 行。

```php run expect="2" title="第二行"
<?php
echo __LINE__, "\n";
```

输出里能看到 `2`。

### 函数名

`__FUNCTION__` 给出当前函数的名字。

```php run expect="label" title="函数名"
<?php
function label() {
    return __FUNCTION__;
}
echo label(), "\n";
```

输出里能看到 `label`。

### 类名

`__CLASS__` 给出当前类的名字。

```php run expect="Pen" title="类名"
<?php
class Pen {
    public function kind(): string {
        return __CLASS__;
    }
}
echo (new Pen())->kind(), "\n";
```

输出里能看到 `Pen`。
