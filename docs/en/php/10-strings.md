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

PHP measures string length in bytes. `strlen` of `Hello!` is 6.

### Concatenation

The `.` operator joins the two pieces. The space already sits inside the second string.

```php run expect="buy pen" title="Joined"
<?php
echo "buy" . " pen", "\n";
```

The joined text is `buy pen`.

### Length in bytes

`Hello!` occupies six bytes.

```php run expect="6" title="Six bytes"
<?php
echo strlen("Hello!"), "\n";
```

`strlen` returns `6`.

### Replace one piece

`str_replace` swaps pen for ink inside `buypen`.

```php run expect="buyink" title="Replaced with ink"
<?php
echo str_replace("pen", "ink", "buypen"), "\n";
```

The new phrase is `buyink`.
