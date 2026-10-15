---
language: php
chapter: 7
title: "类"
level: intermediate
minutes: 18
goals:
  - "用构造函数保存每个对象的数据"
  - "区分 $this 和类本身"
  - "不把每个对象的数据放进静态属性"
sources:
  - php-manual
  - php-right-way
updated: "2026-10-15"
---

class 把数据和方法放在一起。构造函数 __construct 在 new 时运行。$this->字段 是这个对象自己的数据。方法里不写 $this 就访问不到字段。

静态属性属于类，所有对象共享。不要用它保存「这个人的分数」，否则后创建的对象会看见前一个留下的数。每个对象的数据放在普通属性里。

打印时 echo 方法的返回值。对象本身不会自动变成你想要的句子。

```php run expect="42" title="加一"
<?php
class Num {
  private $n;
  public function __construct($n) { $this->n = $n; }
  public function next() { return $this->n + 1; }
}
echo (new Num(41))->next(), "\n";
```

```php run expect="m" title="名字"
<?php
class Unit {
  private $name;
  public function __construct($name) { $this->name = $name; }
  public function name() { return $this->name; }
}
echo (new Unit("m"))->name(), "\n";
```

```php run expect="10" title="两倍"
<?php
class Line {
  private $width;
  public function __construct($width) { $this->width = $width; }
  public function span() { return $this->width * 2; }
}
echo (new Line(5))->span(), "\n";
```

### 读「加一」

先做这一例。把代码收成一行来记：`<?php class Num { private $n; public function __construct($n) { $this->n = $n; } public function next() { return $this->n + 1; } } echo (new Num(41))-…`。先盖住终端，写下你预测的输出，里面要能找到「42」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 读「名字」

做完上一例再做这一例。把代码收成一行来记：`<?php class Unit { private $name; public function __construct($name) { $this->name = $name; } public function name() { return $this->name; } } echo (n…`。先盖住终端，写下你预测的输出，里面要能找到「m」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 读「两倍」

做完上一例再做这一例。把代码收成一行来记：`<?php class Line { private $width; public function __construct($width) { $this->width = $width; } public function span() { return $this->width * 2; } …`。先盖住终端，写下你预测的输出，里面要能找到「10」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 只改一处：加一

这一例要避开的失误是：方法里把 $this->n 写成 $n，读到的是另一个变量。。对应的做法是：字段在构造函数里赋值。。

把代码收成一行来核对：`<?php class Num { private $n; public function __construct($n) { $this->n = $n; } public function next() { return $this->n + 1; } } echo (new Num(41))-…`。盖住终端，先写下预测，里面要能找到「42」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「42」才算失败。

### 只改一处：名字

这一例要避开的失误是：用静态属性保存每个对象自己的数据。。对应的做法是：通过方法读取，而不是把字段设成随便都能改。。

把代码收成一行来核对：`<?php class Unit { private $name; public function __construct($name) { $this->name = $name; } public function name() { return $this->name; } } echo (n…`。盖住终端，先写下预测，里面要能找到「m」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「m」才算失败。

### 只改一处：两倍

这一例要避开的失误是：echo 对象本身。。对应的做法是：echo 方法返回的数字或字符串。。

把代码收成一行来核对：`<?php class Line { private $width; public function __construct($width) { $this->width = $width; } public function span() { return $this->width * 2; } …`。盖住终端，先写下预测，里面要能找到「10」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「10」才算失败。

## 读完再动手

本章要留下的是 「用构造函数保存每个对象的数据」、「区分 $this 和类本身」、「不把每个对象的数据放进静态属性」。合上抽屉之前，用自己的话说出每一项目标对应哪一个示例的标题。对不上标题，就还没有把目标和代码连起来，先别展开练习答案。

练习的答案默认折着。先在编辑器里自己写，再展开对照。对照时只看输出是否包含期望的那几个字。两道都过了再进入下一章。下一次运行是新进程，这次的变量不会留下。

把这一章当成一次可以反复撤销的实验。点代码块上的 Run 会用示例覆盖编辑器，原来的草稿先备份。你改过的内容如果还想留着，先复制到别处，再点下一例。工具栏的 Run 不会从文档重写编辑器，所以它用来看你改过的版本。两种按钮各做各的事。下载进度写在按钮旁边，第一次打开这种语言时要等它结束，再判断示例是不是写错了。

记录你预测错的那一次。写下你以为会打印的文字，以及实际多出来或少掉的部分。进入下一章之前，要能用一句话说清差在哪。通过只说明期望的那几个字还在，不说明你已经看懂产生它的那一行。章节标题下的目标就是这份验收清单。差两个字也不要靠改期望凑过去。

## 常见错误

- 方法里把 $this->n 写成 $n，读到的是另一个变量。
- 用静态属性保存每个对象自己的数据。
- echo 对象本身。

## 最佳实践

- 字段在构造函数里赋值。
- 通过方法读取，而不是把字段设成随便都能改。
- echo 方法返回的数字或字符串。

## 小结

对象的数据在 $this 上。构造函数负责赋值。静态属性是共享的，不要拿来当个别对象的状态。

## 练习

类保存一个数，方法返回两倍。打印初值 21 的结果。

::: answer 参考答案：两倍值
```php run expect="42" title="参考答案"
<?php
class Num {
  private $n;
  public function __construct($n) { $this->n = $n; }
  public function twice() { return $this->n * 2; }
}
echo (new Num(21))->twice(), "\n";
```
:::

类保存 Ada 并打印。

::: answer 参考答案：标签
```php run expect="Ada" title="参考答案"
<?php
class Tag {
  private $s;
  public function __construct($s) { $this->s = $s; }
  public function get() { return $this->s; }
}
echo (new Tag("Ada"))->get(), "\n";
```
:::

## 延伸阅读

- [PHP Manual](https://www.php.net/manual/en/)（CC BY 3.0，仅链接）
- [PHP: The Right Way](https://phptherightway.com/)（仅链接）

## 参考与致谢

正文为原创。知识点范围参考了 PHP 手册与 PHP: The Right Way，没有逐字搬用原文。
