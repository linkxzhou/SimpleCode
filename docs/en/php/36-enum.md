---
language: php
chapter: 36
title: "PHP enums"
level: intermediate
minutes: 8
goals:
  - "Read an enum case name"
  - "Read a backed integer case"
  - "Compare the same enum case strictly"
sources:
  - php-manual
updated: "2026-10-20"
---

An enum gathers a fixed set of names into one type. A pure enum exposes name. A backed enum also exposes value. Comparisons use the same case rather than a bare string.

### The name of Large is Large

Cup has Small and Large. Cup::Large->name is the string Large.

```php run expect="Large" title="Name Large"
<?php
enum Cup {
    case Small;
    case Large;
}
echo Cup::Large->name, "\n";
```

### The backing value of Many is 9

Qty is backed by int. Few is 2 and Many is 9. Printing the value of Many shows 9.

```php run expect="9" title="Backing value 9"
<?php
enum Qty: int {
    case Few = 2;
    case Many = 9;
}
echo Qty::Many->value, "\n";
```

### The same case compares as yes

Cup::Small written twice is the same case. When === holds, the line is yes.

```php run expect="yes" title="Same case"
<?php
enum Cup {
    case Small;
    case Large;
}
$cup = Cup::Small;
echo $cup === Cup::Small ? "yes\n" : "no\n";
```

### An integer finds Many again

Qty::from(9) finds Many from its backing value. The name is still Many. from throws when the integer is missing, so this sample uses only 9.

```php run expect="Many" title="9 is Many"
<?php
enum Qty: int {
    case Few = 2;
    case Many = 9;
}
echo Qty::from(9)->name, "\n";
```
