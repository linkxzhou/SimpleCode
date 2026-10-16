---
language: php
chapter: 7
title: "PHP Data Types"
level: beginner
minutes: 8
goals:
  - "Report integers and floats with gettype"
  - "Echo true and see 1"
  - "Treat an array as its own type"
sources:
  - php-manual
updated: "2026-10-16"
---

The values below are integers, floats, strings, booleans, and arrays. `gettype` reports the kind of value you pass it.

### Integers and floats

`gettype` answers `integer` for 18 and `double` for 1.5.

```php run expect="integer" title="The integer comes first"
<?php
echo gettype(18), "\n";
echo gettype(1.5), "\n";
```

The first report is `integer`.

### A boolean

`echo` renders `true` as 1. `false` renders as empty text. This call prints only the true value.

```php run expect="1" title="True is 1"
<?php
echo true, "\n";
```

The rendered boolean is `1`.

### An array value

An array has the type name `array`.

```php run expect="array" title="The array type"
<?php
echo gettype(["茶"]), "\n";
```

`gettype` answers `array`.
