---
language: php
chapter: 23
title: "PHP Forms"
level: beginner
minutes: 8
goals:
  - "Leave web forms off this page"
  - "Check a string with a function"
  - "Treat a blank string as missing"
sources:
  - php-manual
updated: "2026-10-16"
---

No browser posts a form to these pages. A function receives the field as a plain string.

### Leave $_POST idle

The next line has a value only after a form submission fills `$_POST`.

```php norun title="No form"
<?php
echo $_POST["name"], "\n";
```

### A name with surrounding spaces

`trim` removes whitespace at both ends. The name `Ada` is still present afterward.

```php run expect="gotAda" title="Trim the spaces"
<?php
function accept_name($name) {
    $name = trim($name);
    if ($name === "") {
        return "missing";
    }
    return "got" . $name;
}
echo accept_name("  Ada"), "\n";
```

The accepted text is `gotAda`.

### A blank field

A string of spaces becomes empty after `trim`. The function then returns `missing`.

```php run expect="missing" title="Only spaces"
<?php
function accept_blank($name) {
    $name = trim($name);
    if ($name === "") {
        return "missing";
    }
    return "got" . $name;
}
echo accept_blank("   "), "\n";
```

The blank input returns `missing`.
