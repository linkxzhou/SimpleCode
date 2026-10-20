---
language: php
chapter: 40
title: "PHP trait"
level: intermediate
minutes: 8
goals:
  - "用 trait 提供 sku 方法"
  - "让类里的方法覆盖 trait"
  - "用 insteadof 在两个 trait 之间选择"
sources:
  - php-manual
updated: "2026-10-20"
---

trait 是一组可以混进类的方法。类里的同名方法盖住 trait。两个 trait 撞名时，用 insteadof 指定留下哪一个。

### 混入的 sku 返回 tea

Tag 提供 sku。Cup 使用这个 trait 后，实例调用 sku 打印 tea。

```php run expect="tea" title="混入 tea"
<?php
trait Tag {
    public function sku(): string {
        return "tea";
    }
}
class Cup {
    use Tag;
}
$cup = new Cup();
echo $cup->sku(), "\n";
```

### 类方法盖住 trait

trait 里的 sku 返回 tea。Cup 自己又写了 sku 并返回 mug。实例打印 mug。

```php run expect="mug" title="盖住后是 mug"
<?php
trait Tag {
    public function sku(): string {
        return "tea";
    }
}
class Cup {
    use Tag;
    public function sku(): string {
        return "mug";
    }
}
$cup = new Cup();
echo $cup->sku(), "\n";
```

### insteadof 留下 Right

Left 和 Right 都有 sku。Cup 声明使用 Right 的版本而不是 Left。打印 right。

```php run expect="right" title="选择 right"
<?php
trait Left {
    public function sku(): string {
        return "left";
    }
}
trait Right {
    public function sku(): string {
        return "right";
    }
}
class Cup {
    use Left, Right {
        Right::sku insteadof Left;
    }
}
$cup = new Cup();
echo $cup->sku(), "\n";
```

### 两个 trait 撞名且不选择时只供阅读

同时 use 两个都有 sku 的 trait 又不写 insteadof，类在编译时就会失败。那一段不放进冒烟。

```php norun title="撞名不能编译"
<?php
trait Left {
    public function sku(): string { return "left"; }
}
trait Right {
    public function sku(): string { return "right"; }
}
class Cup {
    use Left, Right;
}
```
