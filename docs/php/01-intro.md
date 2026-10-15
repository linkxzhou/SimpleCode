---
language: php
chapter: 1
title: "PHP 简介"
level: beginner
minutes: 8
goals:
  - "把计算写成一次请求里能跑完的脚本"
  - "用变量保存单价"
  - "用数组保存不止一个名字"
sources:
  - php-manual
updated: "2026-10-15"
---

这里的 PHP 是一次运行一个文件，没有网页表单，也没有数据库连接。

### 一次运行

脚本从上到下执行，打出结果后就结束。

```php run expect="开始" title="开始"
<?php
echo "开始\n";
```

输出里能看到 `开始`。

### 单价

美元符号开头的名字可以先赋值，再打印。

```php run expect="18" title="单价"
<?php
$price = 18;
echo $price, "\n";
```

输出里能看到 `18`。

### 不止一个名字

数组用方括号按下标取。下标从 0 开始。

```php run expect="笔" title="第二项"
<?php
$names = ["茶", "笔"];
echo $names[1], "\n";
```

输出里能看到 `笔`。
