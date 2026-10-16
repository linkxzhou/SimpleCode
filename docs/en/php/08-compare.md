---
language: php
chapter: 8
title: "PHP Type Comparison"
level: beginner
minutes: 8
goals:
  - "Separate == from ==="
  - "Keep 0 distinct from an empty string"
  - "Compare with === when types must match"
sources:
  - php-manual
updated: "2026-10-16"
---

`==` converts operands before it compares them. `===` also demands the same type.

### Loose equality

The integer 18 and the string `"18"` match under `==`.

```php run expect="相等" title="Equal after conversion"
<?php
echo 18 == "18" ? "相等\n" : "不同\n";
```

The loose test prints `相等`.

### Strict equality

An integer and a string fail `===` because their types differ.

```php run expect="不同" title="Different types"
<?php
echo 18 === "18" ? "相等\n" : "不同\n";
```

The strict test prints `不同`.

### Zero and an empty string

Under `===`, the number 0 and `""` stay different values.

```php run expect="不同" title="Keep them apart"
<?php
echo 0 === "" ? "相等\n" : "不同\n";
```

That pair prints `不同`.
