---
language: php
chapter: 40
title: "PHP traits"
level: intermediate
minutes: 8
goals:
  - "Provide sku from a trait"
  - "Let a class method replace the trait"
  - "Choose between two traits with insteadof"
sources:
  - php-manual
updated: "2026-10-20"
---

A trait is a set of methods a class can mix in. A method written on the class replaces the trait method of the same name. When two traits collide, insteadof chooses which one remains.

### The mixed-in sku returns tea

Tag provides sku. After Cup uses that trait, calling sku on an instance prints tea.

```php run expect="tea" title="Mixin tea"
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

### A class method replaces the trait

sku in the trait returns tea. Cup defines sku again and returns mug. The instance prints mug.

```php run expect="mug" title="Replacement is mug"
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

### insteadof keeps Right

Both Left and Right define sku. Cup keeps the Right version instead of Left. The line is right.

```php run expect="right" title="Choose right"
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

### A trait collision without a choice stays unread

Using two traits that both define sku, without insteadof, fails when the class is compiled. That snippet stays out of the smoke run.

```php norun title="A collision does not compile"
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
