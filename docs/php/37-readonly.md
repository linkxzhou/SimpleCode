---
language: php
chapter: 37
title: "PHP 只读属性"
level: intermediate
minutes: 8
goals:
  - "用构造器提升写下 sku 和数量"
  - "改只读数量时打印 locked"
  - "读取只读类上的名字"
sources:
  - php-manual
updated: "2026-10-20"
---

构造器参数可以提升成属性。加上 readonly 之后，属性只能在构造时写一次。再次赋值抛出 Error，例子把这个错误接住。

### 提升后的数量是 4

sku 和 qty 都写在构造器参数上，并标成 readonly。new Item("tea", 4) 之后打印 qty，得到 4。

```php run expect="4" title="数量 4"
<?php
class Item {
    public function __construct(
        public readonly string $sku,
        public readonly int $qty
    ) {}
}
$item = new Item("tea", 4);
echo $item->qty, "\n";
```

### 再赋值时打印 locked

qty 已经在构造时写成 4。再执行 $item->qty = 9 会抛 Error。catch 打印 locked。

```php run expect="locked" title="不能改数量"
<?php
class Item {
    public function __construct(
        public readonly string $sku,
        public readonly int $qty
    ) {}
}
$item = new Item("tea", 4);
try {
    $item->qty = 9;
    echo "open\n";
} catch (Error $e) {
    echo "locked\n";
}
```

### 只读类的名字是 mug

readonly class 里的属性默认只读。构造时传入 mug，之后只能读 name。

```php run expect="mug" title="名字 mug"
<?php
readonly class Sku {
    public function __construct(public string $name) {}
}
$sku = new Sku("mug");
echo $sku->name, "\n";
```

### 未提升的普通属性仍能改

Note 的 text 不是 readonly。构造时是 tea，随后改成 cup，打印 cup。用来对照上一节的锁定。

```php run expect="cup" title="可以改成 cup"
<?php
class Note {
    public string $text;
    public function __construct(string $text) {
        $this->text = $text;
    }
}
$note = new Note("tea");
$note->text = "cup";
echo $note->text, "\n";
```
