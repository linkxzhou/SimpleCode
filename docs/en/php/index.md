---
language: php
chapter: 0
title: "PHP Tutorial"
minutes: 8
goals:
  - "Print one line with echo"
  - "Open the file with <?php"
  - "Leave standard input unread"
sources:
  - php-manual
updated: "2026-10-16"
---

This book runs one file with `php -q`. The file begins at `<?php`. `STDIN` is undefined, so the samples keep their text in the source.

### The first line

`echo` sends a string to the output. You put the newline in that string yourself.

```php run expect="Hi" title="A greeting"
<?php
echo "Hi\n";
```

The greeting on screen is `Hi`.

### Commas add no space

`echo` can take several arguments in one call. Those arguments are written one after another, with nothing inserted.

```php run expect="tea18" title="Joined"
<?php
echo "tea", 18, "\n";
```

The joined arguments appear as `tea18`.

### Keep input in the source

`fgets(STDIN)` stops because that constant is undefined. When a script needs a line of text, write the line in the file.

```php norun title="No standard input"
<?php
$line = fgets(STDIN);
echo $line;
```

### After chapter 34

Strict mode adds 2 and 5 into 7, and a string argument prints bad. match labels 2 as cup. The enum case Large exposes its name, and Many has backing value 9. Assigning a readonly quantity again prints locked. An arrow function captures a base. A generator yields tea and cup. A trait collision uses insteadof. CSV lines are split with str_getcsv, and only tea quantities are added.
