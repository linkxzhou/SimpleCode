---
language: php
chapter: 6
title: "PHP Heredoc"
level: beginner
minutes: 8
goals:
  - "Write several lines with heredoc"
  - "Expand a variable inside heredoc"
  - "Preserve a dollar sign with nowdoc"
sources:
  - php-manual
updated: "2026-10-16"
---

The closing marker occupies a line by itself. It starts in the first column.

### More than one line

Both lines of the heredoc stay inside the string that `echo` prints.

```php run expect="甲" title="The first line remains"
<?php
$text = <<<TXT
甲
乙
TXT;
echo $text, "\n";
```

The string still opens with `甲`.

### A variable inside heredoc

An unquoted closing marker replaces `$name` with the value it holds.

```php run expect="名称：茶" title="Replaced with 茶"
<?php
$name = "茶";
$text = <<<TXT
名称：$name
TXT;
echo $text, "\n";
```

The expanded line is `名称：茶`.

### A nowdoc

Quotes on the opening label make this a nowdoc, so `$name` stays as characters.

```php run expect="$name" title="Leave it unexpanded"
<?php
$name = "茶";
$text = <<<'TXT'
$name
TXT;
echo $text, "\n";
```

The nowdoc text stays `$name`.
