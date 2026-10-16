---
language: php
chapter: 20
title: "PHP Magic Constants"
level: beginner
minutes: 8
goals:
  - "Read the line number with __LINE__"
  - "Read the function name with __FUNCTION__"
  - "Read the class name with __CLASS__"
sources:
  - php-manual
updated: "2026-10-16"
---

The engine fills magic constants while the script runs. A path on disk is read with a file function.

### The current line

This `echo` stands on line 2, directly under the opening `<?php` tag.

```php run expect="2" title="Line 2"
<?php
echo __LINE__, "\n";
```

`__LINE__` prints `2`.

### The current function

`__FUNCTION__` expands to the name of the function that contains it.

```php run expect="label" title="The function name"
<?php
function label() {
    return __FUNCTION__;
}
echo label(), "\n";
```

The reported name is `label`.

### The current class

`__CLASS__` expands to the name of the class whose method is running.

```php run expect="Pen" title="The class name"
<?php
class Pen {
    public function kind(): string {
        return __CLASS__;
    }
}
echo (new Pen())->kind(), "\n";
```

The reported class is `Pen`.
