---
language: php
chapter: 37
title: "PHP readonly"
level: intermediate
minutes: 8
goals:
  - "Store sku and a quantity with constructor promotion"
  - "Print locked when a readonly quantity is changed"
  - "Read the name on a readonly class"
sources:
  - php-manual
updated: "2026-10-20"
---

A constructor parameter can be promoted to a property. With readonly, the property is written once, during construction. A later assignment throws Error, and the sample catches it.

### The promoted quantity is 4

sku and qty are constructor parameters marked readonly. After new Item("tea", 4), printing qty shows 4.

```php run expect="4" title="Quantity 4"
<?php
class Item {
    public function __construct(
        public readonly string $sku,
        public readonly int $qty
    ) {}
}
$item = new Item("tea", 4);
echo $item->qty, "\n";
```

### A second write prints locked

qty was set to 4 during construction. $item->qty = 9 throws Error. The catch block prints locked.

```php run expect="locked" title="Cannot change quantity"
<?php
class Item {
    public function __construct(
        public readonly string $sku,
        public readonly int $qty
    ) {}
}
$item = new Item("tea", 4);
try {
    $item->qty = 9;
    echo "open\n";
} catch (Error $e) {
    echo "locked\n";
}
```

### The readonly class name is mug

Properties on a readonly class are readonly. The constructor receives mug, and name is only read afterward.

```php run expect="mug" title="Name mug"
<?php
readonly class Sku {
    public function __construct(public string $name) {}
}
$sku = new Sku("mug");
echo $sku->name, "\n";
```

### A plain property can still change

Note text is not readonly. It starts as tea, then becomes cup, and the line is cup. This contrasts with the locked property above.

```php run expect="cup" title="Can become cup"
<?php
class Note {
    public string $text;
    public function __construct(string $text) {
        $this->text = $text;
    }
}
$note = new Note("tea");
$note->text = "cup";
echo $note->text, "\n";
```
