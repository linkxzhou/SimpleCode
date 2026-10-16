---
language: php
chapter: 9
title: "PHP Constants"
level: beginner
minutes: 8
goals:
  - "Define a constant with const"
  - "Define a constant with define"
  - "Write a constant without a dollar sign"
sources:
  - php-manual
updated: "2026-10-16"
---

A constant is set once. The name is written without a leading `$`.

### const

`RATE` multiplies 9, and the product is what gets printed.

```php run expect="18" title="A rate"
<?php
const RATE = 2;
echo 9 * RATE, "\n";
```

The product is `18`.

### define

`define` creates a name while the script is already running.

```php run expect="3" title="A tax figure"
<?php
define("TAX", 3);
echo TAX, "\n";
```

`TAX` prints `3`.

### Read a fixed name

The expression reads `BASE` and adds 8.

```php run expect="18" title="A base"
<?php
const BASE = 10;
echo BASE + 8, "\n";
```

The addition prints `18`.
