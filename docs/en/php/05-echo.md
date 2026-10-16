---
language: php
chapter: 5
title: "PHP echo and print"
level: beginner
minutes: 8
goals:
  - "Print several pieces with echo"
  - "Print one piece with print"
  - "Read the 1 that print returns"
sources:
  - php-manual
updated: "2026-10-16"
---

`echo` is a language construct and can take several arguments. `print` returns the integer 1.

### Several echo arguments

The arguments are written in order. No automatic space appears between them.

```php run expect="firstsecond" title="Two pieces"
<?php
echo "first", "second", "\n";
```

Side by side they show `firstsecond`.

### One print argument

`print` accepts a single argument. This call writes one line.

```php run expect="kept" title="One line"
<?php
print "kept\n";
```

That line shows `kept`.

### The value print returns

`print` writes its argument first. The surrounding `echo` then writes the returned 1.

```php run expect="tea1" title="Text and 1"
<?php
echo print("tea");
```

Text and return value show `tea1`.
