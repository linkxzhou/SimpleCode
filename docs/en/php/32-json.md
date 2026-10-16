---
language: php
chapter: 32
title: "PHP JSON"
level: beginner
minutes: 8
goals:
  - "Encode an object with json_encode"
  - "Keep Chinese characters unescaped"
  - "Read a field back with json_decode"
sources:
  - php-manual
updated: "2026-10-16"
---

Default JSON encoding escapes Chinese characters. `JSON_UNESCAPED_UNICODE` leaves those characters visible.

### Encode one field

The key and the value sit inside one pair of braces.

```php run expect="{\"物\":\"茶\"}" title="One field pair"
<?php
echo json_encode(["物" => "茶"], JSON_UNESCAPED_UNICODE), "\n";
```

The encoded text is `{"物":"茶"}`.

### A numeric value

A numeric price is encoded without surrounding quotes.

```php run expect="{\"price\":18}" title="A number"
<?php
echo json_encode(["price" => 18]), "\n";
```

The encoded price reads `{"price":18}`.

### Decode into an array

The argument `true` makes `json_decode` build an array, so a string key can read the price.

```php run expect="18" title="Read it back"
<?php
$data = json_decode('{"price":18}', true);
echo $data["price"], "\n";
```

The price field is `18`.
