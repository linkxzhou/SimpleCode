---
language: php
chapter: 22
title: "PHP 面向对象"
level: beginner
minutes: 8
goals:
  - "用类保存单价"
  - "用继承复用方法"
  - "把字段留在类里面"
sources:
  - php-manual
updated: "2026-10-15"
---

类把数据和读取它的方法放在一起。

### 构造

创建对象时就把 18 放进单价。

```php run expect="18" title="构造时写入"
<?php
class Pen {
    public function __construct(private int $price) {}
    public function price(): int {
        return $this->price;
    }
}
echo (new Pen(18))->price(), "\n";
```

输出里能看到 `18`。

### 继承

派生类沿用基类的单价，再加自己的名字。

```php run expect="pen 18" title="两项"
<?php
class Item {
    public function __construct(protected int $price) {}
    public function price(): int {
        return $this->price;
    }
}
class PenItem extends Item {
    public function label(): string {
        return "pen";
    }
}
$pen = new PenItem(18);
echo $pen->label(), " ", $pen->price(), "\n";
```

输出里能看到 `pen 18`。

### 两支笔

两个对象各自保存自己的单价。

```php run expect="12 18" title="互不影响"
<?php
class PenPrice {
    public function __construct(private int $price) {}
    public function price(): int {
        return $this->price;
    }
}
$a = new PenPrice(12);
$b = new PenPrice(18);
echo $a->price(), " ", $b->price(), "\n";
```

输出里能看到 `12 18`。
