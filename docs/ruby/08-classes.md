---
language: ruby
chapter: 8
title: "一个文件里的实例变量"
level: intermediate
minutes: 34
goals:
  - "让两个书架各自保存自己的书"
  - "看清漏掉 @ 时写成的是局部变量"
  - "用同一份类定义在一个文件里完成"
sources:
  - lxiy-ruby
  - ruby-twenty
updated: "2026-10-15"
---

到目前为止，书名放在局部变量里。变量离开那一块脚本就没有了，方法之间要传参才能看见。书架这种东西需要活得比一次方法调用更久：创建时定下名字，之后多次 `add`，每次都能看见之前加进去的书。实例变量就是挂在某个对象上的名字，以 `@` 开头。它不属于某一行局部作用域，属于这个对象。两个书架对象就有两套 `@books`，互不覆盖。这一章全部写在一个文件的视角里，类和调用放在同一段脚本中。拆成两个文件涉及加载路径，加载不是实例变量的原理。先把原理在一段脚本里看完。

类 `Shelf` 描述书架能做什么。`initialize` 在 `Shelf.new` 时被调用，参数是书架的名字。`@name` 记下这个名字，`@books` 从两本起步：`"ruby"` 和 `"rail"`。不写 `@` 的 `name = ` 只是方法里的局部变量，方法返回之后就没了，对象上不会留下。这是这一章最容易写错的地方，错了之后没有语法错误。你以为自己存下了名字，后面的方法读 `@name` 却得到 `nil`。`nil` 再去拼字符串，会变成空的那一截，或者在你调用字符串方法时失败。看赋值语句有没有 `@`，比看后面的报错更快。

`add` 往 `@books` 末尾追加。`<<` 改的是这张数组本身，所以下一次在同一个对象上还能看见新书。`label` 把名字和本数拼成一行，例如西柜加进 `"rake"` 之后是 `西柜 3`。本数用 `length`，不要自己用另一个实例变量再记一遍，除非你有必须缓存的理由。两套记录会在某一次 `add` 里漏更新。页数很少的课例不需要缓存。

每段可运行的脚本都把 `class Shelf` 写全。后一段不会记得前一段的类。这是为了能单独运行，不是类的生命周期这么短。在真实项目的一次进程里，类定义会留着，对象可以晚些再创建。

```ruby run expect="西柜 3" title="西柜加进第三本"
class Shelf
  def initialize(name)
    @name = name
    @books = ["ruby", "rail"]
  end

  def add(title)
    @books << title
  end

  def label
    "#{@name} #{@books.length}"
  end
end

west = Shelf.new("西柜")
west.add("rake")
puts west.label
```

`Shelf.new` 产出一个对象，`west` 指向它。`add` 和 `label` 是发给这个对象的消息，和整数上的方法是同一套调用，只是方法由你定义。`initialize` 不由你直接 `west.initialize` 去叫，常规路径是 `new`。直接叫也能发生，会把这个对象的 `@books` 重置回两本，加进去的 `"rake"` 消失。那通常是事故。把重置留在 `new` 的路径上，对象的一生只初始化一次。

第二个书架 `east` 用同一个类创建。它的 `@books` 是另一张数组，初始仍是两本。给 `west` 加书不会改变 `east.label`。若你把书单放在类变量 `@@books` 上，所有书架会共享一张清单，西柜加进去的书会出现在东柜的本数里。类变量适合真正属于类的计数，比如「一共 new 过多少次」，而且那种计数在继承时还有自己的坑。书的清单属于每一柜，用 `@books`。共享要用类变量是一种设计，不是省一个 `@` 的写法。省掉 `@` 得到的是局部变量，不是共享。

```ruby run expect="东柜 2" title="两柜各有各的清单"
class Shelf
  def initialize(name)
    @name = name
    @books = ["ruby", "rail"]
  end

  def add(title)
    @books << title
  end

  def label
    "#{@name} #{@books.length}"
  end
end

east = Shelf.new("东柜")
west = Shelf.new("西柜")
west.add("rake")
puts west.label
puts east.label
```

输出先是 `西柜 3`，再是 `东柜 2`。创建顺序是先东后西，打印顺序是先西后东，本数对得上各自的 `add`。没有调用过 `add` 的东柜保持初始两本。

漏写 `@` 时，`add` 里的 `books = []` 新建一张局部数组，追加只影响这张局部数组。方法结束，局部数组回收，对象上的 `@books` 从来没有被赋值，仍是 `nil`。下面的 `add` 返回 `@books`，打印出来就是 `nil`。局部数组里的 `"rake"` 确实追加成功了，只是没有人把它留在对象上，返回值也没返回那张局部数组。这个方法看起来做了事，对象没有记住。修法是追加到 `@books`，并保证 `initialize` 里先放好一张数组。若 `initialize` 忘了 `@books = []`，正确的 `@books << title` 也会失败，因为 `nil` 不能 `<<`。两个错误的表面报错不同：一个常常安静地返回 `nil`，一个立刻找不到方法。安静的那种更不好查，所以这一块专门把它打印出来。

```ruby run expect="nil" title="局部变量留不住书"
class Shelf
  def initialize(name)
    @name = name
  end

  def add(title)
    books = []
    books << title
    @books
  end
end

west = Shelf.new("西柜")
puts west.add("rake").inspect
```

`inspect` 让 `nil` 以可见的文字出现。若只 `puts west.add("rake")`，`puts` 对 `nil` 输出一行空白，你可能以为打印坏了。空白行是 `nil` 的输出样子。要确认是 `nil`，用检查形式。

外面的代码不能写 `west.@books`。`@` 这个名字只在对象自己的方法里直接可见。这是封装的语法层面：外部若能随便改 `@books`，`label` 所依赖的「数组一定存在」就守不住。需要给外部看本数时，写一个方法，比如已经有的 `label`，或单独的 `count`。`attr_reader :name` 会替你生成一个读 `@name` 的方法，调用时写 `west.name`，没有 `@`。它不生成写方法。`attr_accessor` 连写一起生成，外部就可以 `west.name = "别的"`。书架名字若创建后不该改，只给 reader，或不给，让 `label` 成为唯一出口。生成访问器是在减少样板，不是在把实例变量变成公有字段。你仍然可以在方法里维护不对外的 `@books`。

初始的两本书写在 `initialize` 里，每个新对象拿到自己的数组。若写成类定义下的常量，或写在 `initialize` 之外的某个共享数组上再赋给 `@books`，两个对象会持有同一张数组，`<<` 会互相看见。`@books = ["ruby", "rail"]` 每次执行 `initialize` 都会新建一张，这正是我们要的。把一张已有的数组传进 `initialize` 再直接赋给 `@books`，调用者之后若 `<<`，书架内部也会变。需要隔离时，在 `initialize` 里 `@books = titles.dup`。复制一层数组，里面的字符串仍是原来的缓冲区。书名若会被就地改写，还要决定要不要连字符串一起复制。这门课的 `add` 只追加新书名，初始两本不再改字，一层 `dup` 的问题先留在这里，不在例子里展开复制字符串。

`label` 用双引号插值读取 `@name` 和长度。插值发生在方法运行时，所以能看见刚刚 `add` 的结果。用单引号不会插值，你会看到符号 `@` 的原文而不是柜名。输出若出现 `#{`，先看引号，再看实例变量有没有写上。

同一文件里可以创建再丢弃。局部变量 `west` 被重新赋值时，旧对象若没有别的名字指向它，就会被回收。实例变量跟着对象走，不跟着局部变量的名字走。你把 `west` 指到东柜那个对象，旧的西柜若无引用，它的 `@books` 一起消失。这和「变量是箭头」一致，箭头换了对象，旧对象的数据不会跟着箭头的名字搬家。

`freeze` 钉住的是书架对象本身，阻止再给它的实例变量重新赋值，并不自动钉住 `@books` 那张数组。对象已经 `freeze` 之后，`@books << "rail"` 仍然可以成功，因为追加没有给 `@books` 这个名字换一张新数组，只是改了数组的内容。你若以为钉住对象就等于钉住它拥有的全部数据，西柜的本数仍会变。要连清单一起守住，还得 `@books.freeze`。钉住数组之后，`<<` 才会失败。两层钉住缺一不可。只钉外层，适合防止有人把 `@books` 换成另一张表；只钉内层，适合防止追加。课程里的 `add` 需要追加，所以两层都不钉。知道这个缝，才不会把 `freeze` 当成深度的只读。

```ruby run expect="ruby,rail" title="钉住对象仍可改数组"
class Shelf
  def initialize(name)
    @name = name
    @books = ["ruby"]
  end

  def add(title)
    @books << title
  end

  def label
    @books.join(",")
  end
end

west = Shelf.new("西柜")
west.freeze
west.add("rail")
puts west.label
```

`instance_variable_get` 能从外部按名字读到 `@books`，和 `send` 能叫到方法是同一类开口。调试时它解释「对象里到底有没有这张数组」。业务代码绕过 `label` 去拿内部数组，之后就依赖了私有的形状，你一改成别的结构，外部跟着碎。开口留着是因为完全封死会让排查变难。使用的约定是：正常路径走方法，开口不写进持续存在的调用里。`instance_variables` 列出名字，不列出值。名字在、值是 `nil`，说明赋值漏了或从来没写过。这一对方法用来核对漏写 `@` 的事故，比在外部猜测更直接。

继承时，子类对象仍有自己的实例变量。方法可以共用，数据不因为继承就合并。若子类忘记调用 `super`，父类 `initialize` 里的 `@books` 不会出现，子类对象上的清单仍是 `nil`。`super` 不是语法装饰，是在父类的初始化里把那些 `@` 写上。这一章不建子类，是因为两个实例已经够说明数据各自保存。等需要一种「带锁的柜子」时再继承，并在子类的 `initialize` 里先 `super`。不调用的坑，和漏写 `@` 一样安静，直到第一次 `add`。

两个都叫西柜、书也相同的对象，默认不相等。`==` 在你没定义时比较的是不是同一个对象，不是字段像不像。`west == Shelf.new("西柜")` 为假，即便新对象的初始书也是那两本。若业务把「同一面柜子」定义成名字相同，你要自己写 `==`。一旦写了 `==`，又要把对象当哈希键，就还要写 `hash`，让相等的对象哈希码相同。只写 `==` 不写 `hash`，它们放不进同一个哈希键的约定里。课程的书架不去当键，因此先不写这组方法。需要时再写，并让 `==` 比较 `@name` 与 `@books` 的内容，而不是比较对象身份。身份比较已经有 `equal?`，不必占用 `==`。

```ruby run expect="false" title="两柜默认不是相等"
class Shelf
  def initialize(name)
    @name = name
    @books = ["ruby", "rail"]
  end
end

west = Shelf.new("西柜")
other = Shelf.new("西柜")
puts west == other
puts west.equal?(other)
```

方法里读到的 `@books` 若你返回给外部，外部拿到的是内部那张数组本身，不是副本。调用者 `<<` 会改变柜子的本数，却没有走 `add`。`label` 因此可能被外部悄悄改动。要守住入口，返回 `@books.dup`，让外部拿到另一张数组。字符串元素仍共享，外部若改某个书名的字符，内部仍会看见。完全隔离要连元素一起复制，成本更高。`add` 作为唯一入口时，返回副本是便宜的一层。直接返回内部数组是把封装留在口头上。这一章的 `label` 只返回字符串，字符串是新拼出来的，外部改那份文字不会改 `@name`。优先返回这种已经脱离内部结构的值。

`label` 里用插值读实例变量，读到的 `nil` 会变成空文字，句子仍然能拼出来，例如只有一个空格和本数。这种输出比异常更容易被当成正常的柜名。初始化里把 `@name` 和 `@books` 都放上，就是为了不让 `label` 靠空文字蒙混。若名字允许为空，那是业务，应当在 `initialize` 里显式拒绝空字符串，而不是等 `label` 看起来奇怪。

## 小结

`Shelf` 在 `initialize` 里写下 `@name` 和 `@books`。`add` 必须改到 `@books` 上，西柜加进 `"rake"` 后 `label` 才是 `西柜 3`。东柜是另一个对象，本数仍是 `2`。类变量会让两柜共有一张清单，那是另一种设计。漏掉 `@` 得到的局部变量不会成为共享，只是方法结束就没了，对象上的 `@books` 保持 `nil`。

外部用方法读状态，不写 `west.@books`。`attr_reader` 只生成读方法。每个对象在 `initialize` 里新建自己的数组，避免两柜指着同一张。`new` 负责调用 `initialize`，不要为了重置再从外面叫一次初始化。

## 练习

1. 建一个叫「南柜」的 `Shelf`，初始仍是 `"ruby"` 和 `"rail"`。连续 `add` 两本 `"rake"` 和 `"gem"`，打印 `label`。应当是 `南柜 4`。

::: answer 参考答案
```ruby run expect="南柜 4" title="参考答案"
class Shelf
  def initialize(name)
    @name = name
    @books = ["ruby", "rail"]
  end

  def add(title)
    @books << title
  end

  def label
    "#{@name} #{@books.length}"
  end
end

south = Shelf.new("南柜")
south.add("rake")
south.add("gem")
puts south.label
```
:::

2. `add` 里只用局部变量收书，返回 `@books` 的检查形式。对西柜调用一次，输出应是 `nil`。类仍写在这一段里。

::: answer 参考答案
```ruby run expect="nil" title="参考答案"
class Shelf
  def initialize(name)
    @name = name
  end

  def add(title)
    books = []
    books << title
    @books
  end
end

west = Shelf.new("西柜")
puts west.add("rake").inspect
```
:::
