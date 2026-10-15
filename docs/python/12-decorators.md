---
language: python
chapter: 12
title: "章外面再套一层，名字不要丢掉"
level: advanced
minutes: 27
goals:
  - "用装饰器在盖章函数外面加一层包装"
  - "看到不使用 wraps 时 __name__ 变成 wrapper"
  - "用 functools.wraps 把原函数的名字留在包装上"
sources:
  - lxiy-python
  - byte-of-python
updated: "2026-10-15"
---

盖章函数已经能交回书名。借书台现在想在每次盖章前后做同一件小事：确认包装存在，但不改书名。这种「在函数外面加一层」的需求，若在每个调用点手写，调用点会散落同样的前后步骤，漏掉一处就是有的章没经过确认。装饰器把加层写成一个函数：它接收原来的盖章函数，返回一个新的函数。你用 `@` 把这层套上去。套上去之后，别人调用的名字 stamp 指向的已经是包装，除非你小心地把原函数的身份抄到包装上。身份里最显眼的一项是 `__name__`。不抄，它就叫 wrapper。抄，要用标准库里的 functools.wraps。wraps 不需要安装。

先看不加任何装饰器时，函数的 `__name__` 就是 def 后面的那个名字。这是对照的基准。调用它，交回小径。名字和返回值是两件独立的事。装饰器容易把两者一起弄乱，所以先看干净的样子。

```python run expect="stamp" title="还没有包装时名字就是 stamp"
def stamp(book):
    return book

print(stamp.__name__)
print(stamp("小径"))
```

两行：stamp，然后小径。`__name__` 是字符串。它不参与盖章的业务，日志和错误信息却会用它告诉你正在跑哪个函数。名字若是错的，你会去源码里找一个叫 wrapper 的业务函数，找不到，或者找到一个不相干的。

装饰器本身是一个函数，参数是被包装的函数，返回值是另一个函数。返回的那个通常在内部定义，这样它才能调用原来的函数。内部函数若叫 wrapper，它的 `__name__` 就是 wrapper。`@shout` 写在 def stamp 上面，等价于先定义 stamp，再执行 `stamp = shout(stamp)`。名字 stamp 被重新绑定到包装上。原来的函数还在，只是它的标签现在由包装握着，外面的 stamp 这个标签已经移走了。这和赋值是同一条规则。下面这块不用 wraps，打印名字，应当看到 wrapper。返回值仍是小径，说明包装有调用原函数，业务没丢，身份丢了。

```python run expect="wrapper" title="包装盖住了原来的名字"
def shout(func):
    def wrapper(book):
        return func(book)
    return wrapper

@shout
def stamp(book):
    return book

print(stamp.__name__)
print(stamp("小径"))
```

第一行 wrapper，第二行小径。坑就在第一行。若测试只检查返回值，包装看起来完全正确，名字的丢失要到你打印函数或写日志时才出现。所以这一块把 `__name__` 放进输出。这不是装饰器的唯一身份信息，`__doc__` 文档字符串也会丢。修名字的工具一并会修文档，前提是你用它。

functools.wraps 是一个装饰器，用在 wrapper 上。它从原函数把名字和文档等属性复制到 wrapper。你在 shout 里面给 wrapper 加上 `@functools.wraps(func)`。注意 wraps 的参数是原函数 func，不是字符串。加完之后，外面的 stamp.__name__ 又变回 stamp。调用结果仍然是书名。下面这一块要 import functools。每一块都是新进程，上一块没有包装这一事实也不会留下来，所以函数要重新定义。

```python run expect="stamp" title="wraps 把名字抄回包装"
import functools

def shout(func):
    @functools.wraps(func)
    def wrapper(book):
        return func(book)
    return wrapper

@shout
def stamp(book):
    return book

print(stamp.__name__)
print(stamp("小径"))
```

第一行 stamp，第二行小径。这才是借书台能接受的包装：外面多了一层，日志里的名字仍是盖章。wraps 在标准库里，和 json、math 一样随解释器到来。不要自己用赋值去只抄 `__name__` 而漏掉别的属性，除非你清楚自己漏了什么。wraps 抄的是一组约定好的属性，还包括一个 `__wrapped__`，指向还没被这层包装的函数。调试时可以用它确认原函数还在。业务代码不要依赖 `__wrapped__` 去绕过包装，否则你加的那层确认就白加了。

包装可以做一点真事，而不只是转发。例如在书名外面加上已核对三个字，再交回。这样做改变了返回值，调用者必须知道。装饰器若既改名字又改返回值，出问题时你得分不清是哪一种改动。下面这一块用 wraps 保住名字，同时把返回值变成带标记的句子。期望看标记，也看名字。

```python run expect="已核对小径" title="包装可以改结果但不改名字"
import functools

def mark(func):
    @functools.wraps(func)
    def wrapper(book):
        return "已核对" + func(book)
    return wrapper

@mark
def stamp(book):
    return book

print(stamp.__name__)
print(stamp("小径"))
```

名字仍是 stamp，结果是已核对小径。标记写在包装里，原函数仍只负责交回书名。这种分工让原函数可以单独测试：你在定义装饰之前先测 stamp，或者通过 `__wrapped__` 调用。文章里的例子把装饰写在定义处，调用点看见的是包装后的行为。要看原函数，就不要在那一块里加装饰。

多个装饰器会叠。写在上面的后套上。`@a` 再 `@b` 再 def，先被 b 包，再被 a 包。名字若每一层都用了 wraps，最外面的 `__name__` 仍是原函数的名字。若其中一层忘了，名字就停在那一层的 wrapper。叠两层时更要每层都 wraps。借书台目前只需要一层确认，不要为了演示叠三层。一层已经足够暴露名字问题。

参数若不止 book 一个，包装应当用 `*args` 和 `**kwargs` 转发给原函数，否则多出来的参数会在包装这一层被拒绝，错误看起来像原函数不接受它们，其实是包装的参数表太窄。下面把包装写成可转发的形式，原函数仍只收 book。调用方式和上一块一样。名字靠 wraps 保留。

```python run expect="stamp" title="转发参数时也保留名字"
import functools

def mark(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper

@mark
def stamp(book):
    return book

print(stamp.__name__)
print(stamp("海边"))
```

海边被原样交回，因为这一层 mark 只转发不改字。`*args` 把位置参数收成元组，再展开给 func。元组是不可变的，这里没有默认参数那种共享列表的问题。不要在 wrapper 的默认值里放列表。装饰器已经有足够多的绑定时机，不要再叠一个可变默认。

`@` 只是语法。你完全可以写完函数再 `stamp = mark(stamp)`。两种写法的绑定效果相同。`@` 让包装靠近定义，读的人不会忘。它也让人容易忘了 stamp 这个名字已经不是原来那个函数对象。忘掉的症状就是 `__name__` 和你在 def 行看见的不一致。看见 `@` 就去包装里找 wraps，这可以成为阅读习惯。

装饰器若需要自己的参数，例如标记用哪几个字，就要多一层函数：外层接收「已核对」，中层才接收 func，内层才是 wrapper。三层很容易把 wraps 写错地方。wraps 应当装饰最内层的 wrapper，参数是 func。写到中层上不会得到你要的名字。这一章的例子让标记固定，避免三层。需要参数时再加，并且先用打印 `__name__` 确认你装饰对了层。

不要用装饰器去隐藏失败。包装里若 try 之后什么都不说，盖章的异常会消失，和异常那一章的空 except 一样糟。包装可以记录失败，再把异常抛出去。记录用的句子里带上函数名，而函数名来自 wraps 保住的 `__name__`。名字若已经丢了，记录里每一行都叫 wrapper，记录就没有区分度。这是 wraps 的实际理由，不只是让示例的期望好看。

类也可以被装饰，实例方法也行。方法的包装要留心 self 会作为第一个参数传进来。用 `*args` 转发通常能过去。这一章装饰的是普通函数 stamp，不把类和装饰器捆在同一个例子里。条子上的方法若需要统一的核对，可以以后再套，规则相同：每层都 wraps。

包装若把结果缓存起来，就要说清缓存的是哪一次的书名。一个没有参数的包装可以在第一次调用后把返回值存在包装自己的变量里，第二次不再调用原函数。借书台的盖章若被缓存，第二本会被第一本冒充。这种缓存只在函数没有参数、结果也不会变时才安全。stamp 有书名参数，缓存必须把参数算进键里。键若是列表，又会碰到不可哈希。书名是字符串，可以当键。缓存做在包装的字典里，这个字典若写在装饰器的默认参数上，会再次共享。把字典创建在 shout 被调用的时候，也就是每一份包装自己的闭包里，而不是定义 shout 时的默认值。一层坑套一层坑时，仍然是那两条：对象是不是可变，它是不是只创建一次。

`__name__` 被修好之后，`stamp` 这个标签指向的仍是 wrapper 函数对象，不是原来的函数对象。身份没有变回原函数，只是名字字符串被抄过来了。`stamp is` 原来的函数，结果是 False。日志看名字会看见 stamp，身份比较会看见不是同一个对象。不要用身份去判断「这是不是未经包装的盖章」。要调用原函数，用 wraps 留下的 `__wrapped__`。要看人读的名字，用 `__name__`。两套问题不要混成一套。

装饰器在 def 执行时就套上，不是在第一次调用时才套上。class 语句和 def 语句都属于这一次进程的启动阶段，跑到那一行就绑定。所以包装的创建不会等到有读者来借书。若包装在创建时就访问网络或打开一个并不存在的服务，进程会在定义处失败，哪怕你还没盖章。本环境没有网络，包装里不要做那件事。包装的创建应当只做「记住原函数」这种轻的事，把真正的核对留在调用时。创建时失败和调用时失败，在回溯里的行号不同。行号落在 def 附近，就是套上的时候坏了；落在 wrapper 里面，就是某一次盖章坏了。

阅读带 `@` 的代码，顺序是从下往上看定义、从上往下看套用。先看原函数交回什么，再看每一层包装加了什么。若先看包装，容易以为书名是包装造出来的。小径来自原函数的参数，已核对三个字才来自包装。期望里同时出现名字和句子时，名字检验身份有没有被抄回，句子检验包装有没有多写字。只检验其中一个，另一个可以悄悄坏掉。

包装函数若声明了和原函数不同的参数，调用点会先撞上包装的参数表。错误信息指向 wrapper 那一行，而不是 stamp 那一行。你去改原函数的参数，调用仍然失败。先看 `@` 下面实际绑定的是谁。用了 `*args` 和 `**kwargs` 之后，参数表的冲突消失，类型上的冲突才会回到原函数。借书台的书名是字符串，包装不要在转发之前把它们改成列表，否则下一章的脚本会在 json 里看见一对方括号。转发就原样转发，要改句子就在返回值上加字，并写进期望。

## 小结

`@shout` 等价于定义之后把名字重新绑定到 shout 的返回值。返回的 wrapper 若不处理，`__name__` 就是 wrapper，即使返回值仍然是正确的书名。functools.wraps 写在 wrapper 上，把原函数的名字抄回来，它在标准库里。包装要转发参数时用 `*args` 和 `**kwargs`。不要让包装吞掉异常。

## 练习

写一个不使用 wraps 的装饰器包住 title 函数。打印被包装之后的 `__name__`，应当是 wrapper。函数本身返回夜航。

::: answer 参考答案：名字丢掉
```python run expect="wrapper" title="参考答案"
def box(func):
    def wrapper(book):
        return func(book)
    return wrapper

@box
def title(book):
    return book

print(title.__name__)
print(title("夜航"))
```
:::

用 functools.wraps 改写上一题的装饰器。打印 `__name__`，应当是 title。

::: answer 参考答案：名字留下
```python run expect="title" title="参考答案"
import functools

def box(func):
    @functools.wraps(func)
    def wrapper(book):
        return func(book)
    return wrapper

@box
def title(book):
    return book

print(title.__name__)
```
:::
