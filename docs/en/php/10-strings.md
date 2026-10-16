---
language: php
chapter: 10
title: "PHP Strings"
level: beginner
minutes: 8
goals:
  - "Join strings with a dot"
  - "Count bytes with strlen"
  - "Replace a piece with str_replace"
sources:
  - php-manual
updated: "2026-10-16"
---

PHP measures string length in bytes. `strlen` of `你好` is 6.

### Concatenation

The `.` operator joins the two pieces. The space already sits inside the second string.

```php run expect="buy pen" title="Joined"
<?php
echo "buy" . " pen", "\n";
```

The joined text is `buy pen`.

### Length in bytes

Two Han characters occupy six bytes in UTF-8.

```php run expect="6" title="Six bytes"
<?php
echo strlen("你好"), "\n";
```

`strlen` returns `6`.

### Replace one piece

`str_replace` swaps 笔 for 墨 inside `买笔`.

```php run expect="买墨" title="Replaced with 墨"
<?php
echo str_replace("笔", "墨", "买笔"), "\n";
```

The new phrase is `买墨`.
