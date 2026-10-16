---
language: php
chapter: 2
title: "PHP Installation"
level: beginner
minutes: 8
goals:
  - "Run the file with the php -q button"
  - "Keep install commands out of the source"
  - "Ignore version text from php -v"
sources:
  - php-manual
updated: "2026-10-16"
---

The Run button already provides the interpreter. A source file on this page holds PHP statements only.

### A file that runs

A `<?php` tag plus one `echo` is enough to check this page.

```php run expect="ready" title="Ready"
<?php
echo "ready\n";
```

The status word is `ready`.

### Give each name a value

Assign every variable before it is read. The `echo` then has a value to print.

```php run expect="pen" title="An initial value"
<?php
$item = "pen";
echo $item, "\n";
```

The assigned item is `pen`.

### The install line is a shell command

The `apt` line belongs in a terminal. Inside a `.php` file it is source text for the reader.

```php norun title="Not PHP"
sudo apt install php-cli
```
