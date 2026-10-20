---
language: php
chapter: 36
title: "PHP 枚举"
level: intermediate
minutes: 8
goals:
  - "读取枚举项的名字"
  - "读取带整数底值的枚举"
  - "用同一个枚举项做严格比较"
sources:
  - php-manual
updated: "2026-10-20"
---

枚举把一组固定名字收进一个类型。纯枚举用 name，带底类型的枚举还可以读 value。比较时用同一个 case，而不是拿字符串去比。

### Large 的名字是 Large

Cup 有 Small 和 Large。Cup::Large->name 是字符串 Large。

```php run expect="Large" title="名字 Large"
<?php
enum Cup {
    case Small;
    case Large;
}
echo Cup::Large->name, "\n";
```

### Many 的底值是 9

Qty 的底类型是 int。Few 是 2，Many 是 9。打印 Many 的 value 得到 9。

```php run expect="9" title="底值 9"
<?php
enum Qty: int {
    case Few = 2;
    case Many = 9;
}
echo Qty::Many->value, "\n";
```

### 同一个 case 比较得到 yes

两次写下的 Cup::Small 是同一个枚举项。=== 成立时打印 yes。

```php run expect="yes" title="是同一项"
<?php
enum Cup {
    case Small;
    case Large;
}
$cup = Cup::Small;
echo $cup === Cup::Small ? "yes\n" : "no\n";
```

### 从整数找回 Many

Qty::from(9) 按底值找回 Many。名字仍然是 Many。from 找不到时会抛错，这里只用存在的 9。

```php run expect="Many" title="9 对应 Many"
<?php
enum Qty: int {
    case Few = 2;
    case Many = 9;
}
echo Qty::from(9)->name, "\n";
```
