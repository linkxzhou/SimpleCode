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

```php run expect="笔" title="Prepared locally"
<?php
$query = ["item" => "笔"];
echo $query["item"], "\n";
```

The local item is `笔`.

### A key that is absent

If `item` is missing, `??` supplies `无`.

```php run expect="无" title="The item is missing"
<?php
$query = [];
echo $query["item"] ?? "无", "\n";
```

The missing key prints `无`.
