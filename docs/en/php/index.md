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

```php run expect="你好" title="A greeting"
<?php
echo "你好\n";
```

The greeting on screen is `你好`.

### Commas add no space

`echo` can take several arguments in one call. Those arguments are written one after another, with nothing inserted.

```php run expect="茶18" title="Joined"
<?php
echo "茶", 18, "\n";
```

The joined arguments appear as `茶18`.

### Keep input in the source

`fgets(STDIN)` stops because that constant is undefined. When a script needs a line of text, write the line in the file.

```php norun title="No standard input"
<?php
$line = fgets(STDIN);
echo $line;
```
