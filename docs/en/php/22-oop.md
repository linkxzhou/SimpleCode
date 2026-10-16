---
language: php
chapter: 22
title: "PHP Object-Oriented Programming"
level: beginner
minutes: 8
goals:
  - "Store a price on a class"
  - "Reuse a method through inheritance"
  - "Keep each price on its own object"
sources:
  - php-manual
updated: "2026-10-16"
---

A class keeps fields next to the methods that read them. The samples build small pen objects.

### A constructor argument

The constructor stores 18 in the private price field as the object is created.

```php run expect="18" title="Set in the constructor"
<?php
class Pen {
    public function __construct(private int $price) {}
    public function price(): int {
        return $this->price;
    }
}
echo (new Pen(18))->price(), "\n";
```

The price method returns `18`.

### A derived class

`PenItem` inherits `price` from `Item` and adds its own label.

```php run expect="pen 18" title="Two parts"
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

Label and price print `pen 18`.

### Two separate objects

Each object keeps the price passed to its own constructor.

```php run expect="12 18" title="Separate prices"
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

The two objects print `12 18`.
