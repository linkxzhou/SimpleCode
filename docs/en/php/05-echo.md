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

```php run expect="甲乙" title="Two pieces"
<?php
echo "甲", "乙", "\n";
```

Side by side they show `甲乙`.

### One print argument

`print` accepts a single argument. This call writes one line.

```php run expect="留下" title="One line"
<?php
print "留下\n";
```

That line shows `留下`.

### The value print returns

`print` writes its argument first. The surrounding `echo` then writes the returned 1.

```php run expect="茶1" title="Text and 1"
<?php
echo print("茶");
```

Text and return value show `茶1`.
