---
language: php
chapter: 27
title: "PHP Files"
level: beginner
minutes: 8
goals:
  - "Leave disk paths unread"
  - "Split one line with explode"
  - "Split several lines on newlines"
sources:
  - php-manual
updated: "2026-10-16"
---

On a normal machine, `file_get_contents` reads a filesystem path. These samples keep the text inside the script.

### Leave the path unread

`note.txt` is outside this run, so the sample stays idle.

```php norun title="Do not read the disk"
<?php
echo file_get_contents("note.txt");
```

### Split on a space

`explode` separates the label from the price at the space.

```php run expect="茶 18" title="Two fields"
<?php
$parts = explode(" ", "茶 18");
echo $parts[0], " ", $parts[1], "\n";
```

The two parts are `茶 18`.

### Split on newlines

A newline divides the text into two lines, so the count is 2.

```php run expect="2" title="Two lines"
<?php
$lines = explode("\n", "茶\n笔");
echo count($lines), "\n";
```

`count` on the pieces reports `2`.
