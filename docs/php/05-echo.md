---
language: php
chapter: 5
title: "PHP echo 与 print"
level: beginner
minutes: 8
goals:
  - "用 echo 输出多段"
  - "用 print 输出一段"
  - "知道 print 会返回 1"
sources:
  - php-manual
updated: "2026-10-15"
---

`echo` 是语句，可以接多段。`print` 是有返回值的，返回 1。

### echo 多段

三段连着写，中间没有自动空格。

```php run expect="firstsecond" title="两段"
<?php
echo "first", "second", "\n";
```

输出里能看到 `firstsecond`。

### print

`print` 只接受一段，这里打出一行。

```php run expect="kept" title="一行"
<?php
print "kept\n";
```

输出里能看到 `kept`。

### 返回值

`print` 先打出文字，再把 1 交给外面的 `echo`。

```php run expect="tea1" title="文字和 1"
<?php
echo print("tea");
```

输出里能看到 `tea1`。
