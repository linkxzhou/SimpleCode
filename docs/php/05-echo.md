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

```php run expect="甲乙" title="两段"
<?php
echo "甲", "乙", "\n";
```

输出里能看到 `甲乙`。

### print

`print` 只接受一段，这里打出一行。

```php run expect="留下" title="一行"
<?php
print "留下\n";
```

输出里能看到 `留下`。

### 返回值

`print` 先打出文字，再把 1 交给外面的 `echo`。

```php run expect="茶1" title="文字和 1"
<?php
echo print("茶");
```

输出里能看到 `茶1`。
