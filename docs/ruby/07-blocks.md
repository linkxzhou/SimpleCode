---
language: ruby
chapter: 7
title: "方法把一段块借走"
level: intermediate
minutes: 34
goals:
  - "写出带 yield 的方法并传进书名"
  - "在没有块时用 block_given? 避开失败"
  - "看清花括号和 do/end 绑到哪一次调用"
sources:
  - lxiy-ruby
  - ruby-twenty
updated: "2026-10-15"
---

块是一段暂时交给方法的代码。方法决定调用它几次、传什么进去。你决定里面算什么。`each` 和 `map` 已经在用这个机制，只是那两个方法是语言自带的。这一章自己写方法，把借走块的动作显式写成 `yield`。数据仍是书名。先从一本 `"ruby"` 开始，再回到两本的清单 `"ruby"` 和 `"rail"`。

`yield` 的意思是：把控制权交到调用这个方法时附带的块，块结束再回到 `yield` 的下一行。`yield title` 把书名作为块参数传进去。块里用 `|loud|` 接住。可以 `yield` 多次，每次都可以传不同的值。方法若在没有任何块的情况下 `yield`，会以 `LocalJumpError` 结束。这不是参数填错，是「你说要借代码，调用处却没借」。库方法通常在入口看 `block_given?`，有块才 `yield`，没有块就返回一个还算有用的默认值，比如原书名。强制要求块的方法也可以不判断，让错误冒出来。选择取决于缺少块是用法错误还是一种合法的简写。

```ruby run expect="RUBY" title="yield 把书名交给块"
def announce(title)
  yield title.upcase
end

announce("ruby") { |loud| puts loud }
announce("rail") { |loud| puts loud }
```

两行是 `RUBY` 和 `RAIL`。`upcase` 发生在方法内部，块收到的已经是大写。也可以把原始书名交出去，让块自己决定要不要大写。转换放在哪一侧，是接口的取舍。放在方法里，所有调用者得到同一种规格，块只负责消费。放在块里，方法保持无知，每个调用者可以做不同的事。`map` 选择后者，所以它什么类型都能迭代。`announce` 若把大写写死，它就不再适合「只想要原始书名」的调用者。下面改成把原书名交出去，没有块时返回原书名，有块时返回块的计算结果。

```ruby run expect="rake" title="没有块就返回原书名"
def announce(title)
  if block_given?
    yield title
  else
    title
  end
end

puts announce("rake")
puts announce("rake") { |title| title.upcase }
```

第一行是方法的返回值 `rake`，因为没有块，`yield` 没有执行。第二行是块返回的 `RAKE`，方法把 `yield` 的结果又返回出去。`puts` 打印的是 `announce` 的返回值。块里的最后一个表达式就是块的返回值。块里若写了 `puts`，块的返回值会变成 `nil`，方法再把 `nil` 交出去，你会多打印一行空，或在 `map` 里收集到一串 `nil`。块要么负责副作用，要么负责交回一个值，两件事都做时要清楚哪个是返回值。需要两边都要，就让块交回值，由方法或调用者去打印。

`block_given?` 只关心有没有块，不关心块会返回什么。它必须写在方法里面，写在外面没有「当前方法的块」可问。有人把它写成 `announce("rake").block_given?`，那是在给字符串发消息，字符串没有这个方法。

花括号和 `do`/`end` 都能写块，优先级不同。花括号绑得更紧，会和左边最近的方法结合。`do`/`end` 绑得松，会尽量当作外层调用的块。这个差别在只有一个方法时看不见。一加上 `puts`，同样的书单会走出两条路。`puts books.map { |title| title.upcase }` 里，花括号属于 `map`，`map` 得到大写数组，`puts` 再把数组拆成两行 `RUBY` 和 `RAIL`。

```ruby run expect="RUBY" title="花括号属于 map"
books = ["ruby", "rail"]
puts books.map { |title| title.upcase }
```

把花括号换成 `do`/`end`，并且不给 `puts` 加括号，块会挂到 `puts` 上。`map` 没有收到块，于是返回一个枚举器，而不是数组。`puts` 收到这个枚举器和一个自己用不上的块。枚举器的文字里带有 `Enumerator`。你不会看见 `RUBY`。书单没有被大写，也没有报错。程序成功退出，输出却是调试信息的样子。这是优先级造成的安静失败，和键找错时得到 `nil` 属于同一类：没有异常，结果不是你要的规格。

```ruby run expect="Enumerator" title="do/end 挂到了 puts"
books = ["ruby", "rail"]
puts books.map do |title|
  title.upcase
end
```

要让 `do`/`end` 属于 `map`，给 `map` 的调用加上括号：`puts(books.map do |title| title.upcase end)`。括号把 `map` 和它的块包成一个参数。花括号通常不需要这层，因为它们已经绑得够紧。团队若两种块写法都用，约定可以是：一行用花括号，多行用 `do`/`end` 并且给接收块的那次调用加括号。不加括号的多行 `do` 放在另一方法的参数位置，就是这一块所演示的错绑。

枚举器是还没开始跑的迭代。`books.map` 不带块时得到它。你可以以后再 `each`，也可以在别的方法里继续接。它的好处是把「怎么遍历」和「现在就遍历」分开。坏处是一不小心把它交出去，调用者以为自己拿到了数组，实际拿到了一个还没产生元素的对象。`puts` 不会替你把枚举器跑完再拆行，它只是把对象的文字打出来。看见 `Enumerator` 时，先找块挂到了谁身上，而不是先怀疑 `upcase`。

`yield` 也可以放在循环里，把书单的每一项交出去。那就接近自己写一个 `each`。写之前先问标准库里是不是已经有。有 `each` 还自己写，只会在边界上和大家不一致，比如忘了返回原数组。学习时写一次是为了看见 `yield`，不是为了替换 `each`。下面这个方法只负责把两本书依次交出去，打印仍由块来做。

```ruby run expect="rail" title="两次 yield"
def each_title(books)
  yield books[0]
  yield books[1]
end

each_title(["ruby", "rail"]) { |title| puts title }
```

这里写死了两本，是为了让 `yield` 的次数在方法正文里看得见。真正的 `each` 会按长度跑，空数组一次都不 `yield`。我们的版本在空数组上会在 `books[0]` 处得到 `nil` 并传给块。这就是自己重写迭代容易漏掉的边界。例子的调用始终传入两本，和变量名字一致。不要把这个方法拿去遍历任意长度。

块能看见外面的局部变量。计数器放在外面，块里 `count = count + 1`，结束后外面的 `count` 变了。这让累计变得直接，也让块有能力改掉你不想改的名字。块参数 `|title|` 若和外面的 `title` 同名，规则足以让人困惑。避免同名，比把规则背全更有用。这一章外面不用 `title` 这个名字保存别的东西。

方法可以接收显式的 `Proc`，那是把块收成对象的做法，调用时用 `call`。普通的 `yield` 更短，也更接近 `each` 的用法。需要把同一段块存起来、交给别的方法、或调用多次且中间要传递这个对象时，才值得收成 `Proc`。大多数书名处理不需要。过早收成对象，会让调用从 `announce("ruby") { ... }` 变成一堆 `call`，读起来更远。

块里的 `return` 离开的是定义块的那个方法，不是离开块本身。这和块的「最后一个表达式当作返回值」不同。`return` 是跳转。下面的 `run` 把块交给 `announce`，块里 `return` 大写书名，`announce` 里 `yield` 之后的 `"after"` 不会再变成 `run` 的结果，`run` 里 `announce` 之后的 `"never"` 也不会执行。打印出来只有 `RUBY`。你若只是想让块产出一个值，写 `title.upcase`，不要写 `return`。`return` 适合在块里发现无法继续、并且整个方法都该结束的时候。用它来充当普通返回值，调用栈会被切掉一段，后面的收尾不执行。

```ruby run expect="RUBY" title="块里的 return 离开方法"
def announce(title)
  yield title
  "after"
end

def run
  announce("ruby") { |title| return title.upcase }
  "never"
end

puts run
```

`lambda` 收成的对象则让 `return` 只离开这块代码。普通块和 `lambda` 的差别主要在参数个数检查和 `return` 的目标。`lambda` 对参数个数更严。大多数 `yield` 不需要先收成对象。你在块里想写 `return` 且只想结束块时，才值得改成 `lambda`，并用 `call` 调用。这个差别解释了「为什么我写了 return，后面的行全没了」。先看它坐落在块里还是方法里，再决定要不要改成不带 `return` 的表达式。

块被方法保存起来、等到方法已经返回之后再调用，是更进一步的用法。那时 `return` 要回去的方法已经结束，会出问题。`each` 和 `map` 都是在自己还没返回时同步调用块，所以没有这个时间差。自己写 `yield` 时也保持同步：进入方法，调用块，方法再返回。不要把块存到实例变量里下次再用，除非你改用能独立存在的对象并清楚 `return` 已经不能指向原来的方法。书名处理都是同步的，例子保持同步。

普通块对参数个数偏宽容。`yield title, title.length` 传了两个值，块只写 `|name|` 时，长度被丢掉，不会报错，`name` 仍是书名。这让 `each` 好写，也让你少传、多传都不一定有提醒。`lambda` 会计较个数，少一个或多一个都会失败。宽容的好处是同一块可以交给不同的方法，方法多给的上下文被忽略。坏处是你以为自己接到了长度，实际上参数列表没写上，块里用到的若是外面的同名变量，会悄悄算出另一个结果。块参数和外部变量不要同名，这一条在参数被丢掉时尤其重要。

```ruby run expect="ruby" title="块可以少接参数"
def announce(title)
  yield title, title.length
end

announce("ruby") { |name| puts name }
```

方法可以用 `&` 把块收成参数，再交给另一个方法。`def announce(title, &block)` 里，`block` 在没有块时是 `nil`。你要转交给 `map` 一类的方法时，这个参数有用。直接 `yield` 时不必写出 `&block`，写了又不用，反而让人以为你会保存它。保存块到方法返回之后，就回到前面说过的时间问题。转交应当发生在本次调用之内：收到，交给下一次同步的 `yield` 或 `call`，然后返回。书名从 `"ruby"` 到大写，这条链是同步的。

块里给外层变量赋值，会改外层。累加器因此能工作。也因此，块里写 `title = title.upcase` 若 `title` 是外层已经存在的变量，改的是外层，不是一份块内副本。若 `title` 只是块参数，赋值的规则足以让人写错而不自知。实践上，块参数当常量用，不在块里给它重新赋值。要大写，用另一个名字接住 `upcase` 的返回值。少一次赋值，少一处「到底改到了谁」。

`yield` 的返回值就是块的值，可以参加方法里的下一步运算。`announce` 可以 `yield` 之后再拼一句，而不必让块自己打印。块一旦打印，方法就失去了把结果继续交给别的方法的机会。打印放在最外层，计算放在块里，和「`map` 收集、`puts` 再输出」是同一种分工。顶层脚本只有一层，仍然值得把 `puts` 留在块外面，这样你改文案时不必打开每一个块。

一个方法只 `yield` 一次时，块像一个回调。`yield` 两次时，块像循环体。次数是方法作者的决定，调用者从方法名上看不出来，所以名字要暗示次数，或者文档写在方法旁边。`announce` 一次，`each_title` 两次。不要让一个看起来像「宣布一次」的方法偷偷 `yield` 两次，否则打印会重复，调用者会去改块，而不是去改方法。

## 小结

`announce` 用 `yield` 把书名交给块。没有块时硬 `yield` 会得到 `LocalJumpError`。`block_given?` 让没有块的调用返回原书名，有块的调用返回块的值。块里的最后一个表达式是返回值，在块里 `puts` 会让这个值变成 `nil`。

花括号紧贴 `map`，`puts books.map { ... }` 会把大写书名拆行打印。同样的位置写成 `do`/`end` 且 `puts` 不加括号时，块挂到 `puts`，`map` 返回枚举器，输出里出现 `Enumerator` 而没有大写书名。多行块要属于内层方法，就给那次调用加括号。自己用两次 `yield` 可以看清次数，但不要用它替换能处理空清单的 `each`。

## 练习

1. 写 `announce`，有块则 `yield` 原书名，无块则返回原书名。对 `"ruby"` 不带块打印一次，带块打印它的长度。应当看到 `ruby` 和 `4`。

::: answer 参考答案
```ruby run expect="4" title="参考答案"
def announce(title)
  if block_given?
    yield title
  else
    title
  end
end

puts announce("ruby")
puts announce("ruby") { |title| title.length }
```
:::

2. 书单仍是 `"ruby"` 和 `"rail"`。用带括号的 `puts` 包住 `map` 的 `do`/`end`，让块属于 `map`。输出应有 `RUBY` 和 `RAIL` 两行，不应出现 `Enumerator`。

::: answer 参考答案
```ruby run expect="RAIL" title="参考答案"
books = ["ruby", "rail"]
puts(books.map do |title|
  title.upcase
end)
```
:::
