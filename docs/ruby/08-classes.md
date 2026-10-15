---
language: ruby
chapter: 8
title: "类"
level: intermediate
minutes: 18
goals:
  - "用 initialize 保存每个对象的数据"
  - "区分类方法和实例方法"
  - "知道继承覆盖同名方法"
sources:
  - lxiy-ruby
  - ruby-twenty
  - poignant
updated: "2026-10-15"
---

class 把数据和方法放在一起。initialize 在 new 时运行，习惯把每个对象自己的数据放进 @ 开头的实例变量。实例变量不需要事先声明。忘记在 initialize 里赋值，后面读取会得到 nil。

实例方法的接收者是那个对象。调用时写对象.方法，不要自己把对象再传一遍。类方法写成 def self.名字，属于类本身，适合做不依赖某一个对象的构造。@@ 开头的类变量被所有实例共享，教学里不用它当「每个对象自己的计数」，因为一处改了全班都看见。

子类用 < 继承。同名方法覆盖父类。还需要父类行为时写 super。不要把继承理解成「把父类的代码复制一份」。对象的相等默认比的是是不是同一个对象。需要按字段比较时再定义 ==。

attr_reader 帮你写出读取实例变量的方法。能用它就不必手写只有一行的 getter。打印对象时如果没有定义可读的形式，你只会看到一串地址。调试时至少 puts 你关心的那个字段。

```ruby run expect="10" title="两倍宽"
class Line
  def initialize(width)
    @width = width
  end
  def span
    @width * 2
  end
end
puts Line.new(5).span
```

```ruby run expect="2" title="覆盖"
class A
  def n
    1
  end
end
class B < A
  def n
    super + 1
  end
end
puts B.new.n
```

```ruby run expect="m" title="读取"
class Unit
  attr_reader :name
  def initialize(name)
    @name = name
  end
end
puts Unit.new("m").name
```

### 读「两倍宽」

先做这一例。把代码收成一行来记：`class Line def initialize(width) @width = width end def span @width * 2 end end puts Line.new(5).span`。先盖住终端，写下你预测的输出，里面要能找到「10」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 读「覆盖」

做完上一例再做这一例。把代码收成一行来记：`class A def n 1 end end class B < A def n super + 1 end end puts B.new.n`。先盖住终端，写下你预测的输出，里面要能找到「2」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 读「读取」

做完上一例再做这一例。把代码收成一行来记：`class Unit attr_reader :name def initialize(name) @name = name end end puts Unit.new("m").name`。先盖住终端，写下你预测的输出，里面要能找到「m」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 只改一处：两倍宽

这一例要避开的失误是：把每个对象的计数放在类变量里，结果所有对象共用一个数。。对应的做法是：每个对象的数据放在实例变量里，并在 initialize 赋值。。

把代码收成一行来核对：`class Line def initialize(width) @width = width end def span @width * 2 end end puts Line.new(5).span`。盖住终端，先写下预测，里面要能找到「10」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「10」才算失败。

### 只改一处：覆盖

这一例要避开的失误是：覆盖方法后忘了 super，父类里必要的初始化没有跑。。对应的做法是：只读字段用 attr_reader。。

把代码收成一行来核对：`class A def n 1 end end class B < A def n super + 1 end end puts B.new.n`。盖住终端，先写下预测，里面要能找到「2」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「2」才算失败。

### 只改一处：读取

这一例要避开的失误是：new 的时候漏了 initialize 的参数，得到 ArgumentError 却去改调用以外的代码。。对应的做法是：覆盖后如果还要父类的结果，显式 super。。

把代码收成一行来核对：`class Unit attr_reader :name def initialize(name) @name = name end end puts Unit.new("m").name`。盖住终端，先写下预测，里面要能找到「m」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「m」才算失败。

## 读完再动手

本章要留下的是 「用 initialize 保存每个对象的数据」、「区分类方法和实例方法」、「知道继承覆盖同名方法」。合上抽屉之前，用自己的话说出每一项目标对应哪一个示例的标题。对不上标题，就还没有把目标和代码连起来，先别展开练习答案。

练习的答案默认折着。先在编辑器里自己写，再展开对照。对照时只看输出是否包含期望的那几个字。两道都过了再进入下一章。下一次运行是新进程，这次的变量不会留下。

把这一章当成一次可以反复撤销的实验。点代码块上的 Run 会用示例覆盖编辑器，原来的草稿先备份。你改过的内容如果还想留着，先复制到别处，再点下一例。工具栏的 Run 不会从文档重写编辑器，所以它用来看你改过的版本。两种按钮各做各的事。下载进度写在按钮旁边，第一次打开这种语言时要等它结束，再判断示例是不是写错了。

记录你预测错的那一次。写下你以为会打印的文字，以及实际多出来或少掉的部分。进入下一章之前，要能用一句话说清差在哪。通过只说明期望的那几个字还在，不说明你已经看懂产生它的那一行。章节标题下的目标就是这份验收清单。差两个字也不要靠改期望凑过去。

## 常见错误

- 把每个对象的计数放在类变量里，结果所有对象共用一个数。
- 覆盖方法后忘了 super，父类里必要的初始化没有跑。
- new 的时候漏了 initialize 的参数，得到 ArgumentError 却去改调用以外的代码。

## 最佳实践

- 每个对象的数据放在实例变量里，并在 initialize 赋值。
- 只读字段用 attr_reader。
- 覆盖后如果还要父类的结果，显式 super。

## 小结

类用 initialize 和实例变量保存每个对象的数据。子类可以覆盖方法并用 super 复用父类。类变量是共享的，不要拿来当个别对象的状态。

## 练习

定义只有一个数的类，方法 next 返回这个数加 1。打印初值为 41 的结果。

::: answer 参考答案：加一
```ruby run expect="42" title="参考答案"
class Num
  def initialize(n)
    @n = n
  end
  def next
    @n + 1
  end
end
puts Num.new(41).next
```
:::

用 attr_reader 保存 name，打印 Ada。

::: answer 参考答案：名字
```ruby run expect="Ada" title="参考答案"
class Person
  attr_reader :name
  def initialize(name)
    @name = name
  end
end
puts Person.new("Ada").name
```
:::

## 延伸阅读

- [Ruby in Twenty Minutes](https://www.ruby-lang.org/en/documentation/quickstart/)（仅链接）
- [Learn X in Y minutes — Ruby](https://learnxinyminutes.com/ruby/)（CC BY-SA 3.0，仅链接）

## 参考与致谢

正文为原创。知识点范围参考了 Ruby 官方二十分钟入门与 Learn X in Y minutes — Ruby，没有逐字搬用原文。
