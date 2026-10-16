---
language: php
chapter: 16
title: "PHP Superglobals"
level: beginner
minutes: 8
goals:
  - "Leave $_GET unread on this page"
  - "Replace query parameters with an array"
  - "Fill a missing key with ??"
sources:
  - php-manual
updated: "2026-10-16"
---

These pages receive no HTTP request. `$_GET` and `$_POST` appear only in samples that are not run.

### Leave the request sample idle

The next line is meaningful only when a real request supplies `$_GET`.

```php norun title="No request"
<?php
echo $_GET["item"], "\n";
```

### An array written in the file

The query values live in an array the script builds itself.

```php run expect="pen" title="Prepared locally"
<?php
$query = ["item" => "pen"];
echo $query["item"], "\n";
```

The local item is `pen`.

### A key that is absent

If `item` is missing, `??` supplies `none`.

```php run expect="none" title="The item is missing"
<?php
$query = [];
echo $query["item"] ?? "none", "\n";
```

The missing key prints `none`.
