---
language: python
chapter: 13
title: "把东柜收成一份能跑完的脚本"
level: advanced
minutes: 30
goals:
  - "用一张条子类和一份字典把借还收进同一次进程"
  - "查不到时抛出异常，费用用 math 收成整数"
  - "把当班结果用 json 印成稳定的文本"
sources:
  - lxiy-python
  - byte-of-python
updated: "2026-10-15"
---

前面每一章都把借书台拆开看过：名字怎么绑、字怎么切、空值怎么判断、名单怎么复制、索书号怎么当键、默认参数怎么共享、失败怎么说、json 和 math 做什么、条子为什么要有 self、催还为什么可以惰性、包装为什么会弄丢名字。东柜真正值班时这些事发生在同一份脚本里。这一章把它们收成一份短脚本，仍然遵守每一次运行都是新进程的限制。脚本不读网络，不写你下次还能看见的文件，不安装任何包。它在一次进程里完成：登记两本在架的书，借出其中一本，拒绝一本没有的书，计算滞纳金，最后把结果印成 json。

脚本和前面那些小块的差别不在语法，而在一份数据要活过多次操作。在小块里，每次操作都重新写出字典。在脚本里，字典放在开头，后面的函数通过参数接收它，或者通过柜台对象持有它。不要用模块级的可变对象再叠加一个带默认列表的函数，那会把函数章和类章的两个坑叠在同一张柜台上。柜台对象的列表做在 self 上。查找失败用异常，不用空字符串，因为这份脚本后面还要印 json，空书名会悄悄进文本。

先定义条子和柜台。条子记住读者、书和费用。柜台记住索书号到书名的架子，以及已经借出的条子。借出时若索书号不在架子上，抛出 KeyError。在架子上，就做出条子放进自己的列表，并返回那张条子。费用由调用者算好传进来，柜台不偷偷读时钟。

```python run expect="林夏" title="柜台只借架上有的书"
class Slip:
    def __init__(self, reader, book, fee):
        self.reader = reader
        self.book = book
        self.fee = fee

    def line(self):
        return f"{self.reader}《{self.book}》"

class Desk:
    def __init__(self):
        self.shelf = {"I247.5/12": "小径", "I247.5/18": "海边"}
        self.out = []

    def lend(self, call, reader, fee):
        if call not in self.shelf:
            raise KeyError(call)
        slip = Slip(reader, self.shelf[call], fee)
        self.out.append(slip)
        return slip

desk = Desk()
slip = desk.lend("I247.5/12", "林夏", 2)
print(slip.reader)
print(len(desk.out))
```

林夏被印出来，借出列表的长度是 1。架子用字典，键是字符串索书号，不是书名列表。书名列表当键会在构造时失败，这个柜台用不上那种键。两张不同的 Desk 实例不会共享 out，因为 out 在 `__init__` 里赋给 self。若有人把 `out = []` 写到 class 下面，第二位读者会看见第一位的条子。这里没有那样写。

费用用 math.ceil。单价 0.4，林夏逾期 3 天，费用是 2。这个数在借出之前算好，再传给 lend。把计算放在脚本的前部，柜台只负责登记已经决定的整数。整数进 json 不会带上小数。下面在同一进程里算费用、借出、再借一本没有的号。没有的号被接住，打印缺失，不让进程失败。已借出的读者仍然会印出来。

```python run expect="缺失" title="没有的号不会冒充空书名"
import math

class Slip:
    def __init__(self, reader, book, fee):
        self.reader = reader
        self.book = book
        self.fee = fee

class Desk:
    def __init__(self):
        self.shelf = {"I247.5/12": "小径"}
        self.out = []

    def lend(self, call, reader, fee):
        if call not in self.shelf:
            raise KeyError(call)
        slip = Slip(reader, self.shelf[call], fee)
        self.out.append(slip)
        return slip

fee = math.ceil(0.4 * 3)
desk = Desk()
slip = desk.lend("I247.5/12", "林夏", fee)
print(slip.fee)
try:
    desk.lend("Z9", "周予", 0)
except KeyError:
    print("缺失")
print(len(desk.out))
```

三行是 2、缺失、1。周予没有被放进 out。若 lend 在失败时返回空字符串，第三行的长度可能仍是 1，但调用者若忘记检查，会把空串当条子去取 reader，那是 AttributeError，或者更糟，把空串写进 json。现在失败停在 lend 里面，except 明确说缺失。长度仍是 1，说明异常发生时 append 还没有执行。这要靠「先检查再 append」的顺序。若先 append 再检查，失败也会留下一张半成品。顺序是脚本的一部分，不是例外处理的边角。

借出的结果要离开内存的对象图，变成可以核对的文本。json 不认识 Slip 类。先把条子变成字典，再 dumps。ensure_ascii=False 让小径保持汉字。不要把对象的地址放进字典。下面只输出读者、书和费用三个字段。

```python run expect="小径" title="借出结果写成 json"
import json
import math

class Slip:
    def __init__(self, reader, book, fee):
        self.reader = reader
        self.book = book
        self.fee = fee

    def as_dict(self):
        return {"reader": self.reader, "book": self.book, "fee": self.fee}

class Desk:
    def __init__(self):
        self.shelf = {"I247.5/12": "小径", "I247.5/18": "海边"}
        self.out = []

    def lend(self, call, reader, fee):
        if call not in self.shelf:
            raise KeyError(call)
        slip = Slip(reader, self.shelf[call], fee)
        self.out.append(slip)
        return slip

    def report(self):
        payload = [slip.as_dict() for slip in self.out]
        return json.dumps(payload, ensure_ascii=False)

desk = Desk()
desk.lend("I247.5/12", "林夏", math.ceil(0.4 * 3))
text = desk.report()
print(json.loads(text)[0]["book"])
print(json.loads(text)[0]["fee"])
```

书是小径，费用是 2。report 用列表推导做出新列表，不修改 out 里的条子。dumps 的是普通的字典和整数，loads 可以读回。读回的是新对象，改它不会改条子。这是脚本和交互式草稿的一个差别：核对用的是文本里的字段，不是某一次打印碰巧带上的空格。

催还可以从 out 里惰性取出费用大于 0 的读者。生成器只在被要求时才看下一张条子。今天只有一张，next 得到林夏。不要打印生成器本身。

```python run expect="林夏" title="只取下一张要催的条子"
import math

class Slip:
    def __init__(self, reader, book, fee):
        self.reader = reader
        self.book = book
        self.fee = fee

class Desk:
    def __init__(self):
        self.shelf = {"I247.5/12": "小径"}
        self.out = []

    def lend(self, call, reader, fee):
        book = self.shelf[call]
        slip = Slip(reader, book, fee)
        self.out.append(slip)
        return slip

    def owing(self):
        for slip in self.out:
            if slip.fee > 0:
                yield slip

desk = Desk()
desk.lend("I247.5/12", "林夏", math.ceil(0.4 * 3))
print(next(desk.owing()).reader)
```

owing 每次调用都返回新的生成器，所以可以再次从头走。它遍历的是列表 out，列表本身可以反复看。生成器用尽不影响列表。这个组合把迭代器那一章的「用尽」限制在生成器上，把数据留在列表上。若 out 本身被换成生成器，第二遍催还就会是空的。数据用列表，遍历用生成器，职责分开。

输入可以决定读者的名字，但费用和索书号仍写在源码里，避免整份脚本依赖一长串stdin 的顺序。下面只把读者名从输入读进来，嵌进结果。样例输入是林夏。提示不换行，所以期望抓住后面的书名即可。

```python run stdin="林夏" expect="小径" title="读者名来自这一次输入"
import json
import math

class Slip:
    def __init__(self, reader, book, fee):
        self.reader = reader
        self.book = book
        self.fee = fee

reader = input("读者？")
fee = math.ceil(0.4 * 3)
slip = {"reader": reader, "book": "小径", "fee": fee}
text = json.dumps(slip, ensure_ascii=False)
print(json.loads(text)["book"])
print(json.loads(text)["reader"])
```

这一块没有用类，是为了让输入、费用和 json 在短路径上同时出现。上一块的类仍然是柜台的正形。脚本变长时，把短路径收进 Desk.lend，而不是让 input 散落在每个方法里。输入留在脚本的最外层：读到名字，再传给 lend。方法里调用 input，会让同一方法在测试里忽然停住，也会让「借出」这件事依赖于终端。最外层负责边界，对象负责架子和条子。

还可以给 lend 套一层只用于日志的包装。包装必须用 functools.wraps，否则日志里的名字变成 wrapper，你分不清是借出失败还是别的函数失败。这一章的最后一块演示包装之后名字仍是 lend，同时借出仍然成功。包装不吞掉 KeyError。

```python run expect="lend" title="包装之后仍能认出借出"
import functools

class Desk:
    def __init__(self):
        self.shelf = {"I247.5/12": "小径"}

    def lend(self, call):
        if call not in self.shelf:
            raise KeyError(call)
        return self.shelf[call]

def logged(func):
    @functools.wraps(func)
    def wrapper(self, call):
        return func(self, call)
    return wrapper

Desk.lend = logged(Desk.lend)
desk = Desk()
print(desk.lend.__name__)
print(desk.lend("I247.5/12"))
```

`__name__` 是 lend，返回值是小径。方法的包装要接收 self。这里在类定义之后替换 Desk.lend，是为了把包装写得看得见。写成 `@logged` 放在 def 上面也可以，但方法装饰器要确认 wraps 在最内层。两种写法都不要把 wrapper 的名字留到日志里。

这份脚本仍然很短。它没有界面，没有账户，没有把 json 存到磁盘。短是因为环境只保证这一次进程。你若在自己的电脑上把 report 的文本写进文件，那是下一步，不在这些代码块里。下一步之前，先让同一次进程里的行为对得上：架上没有的号会说缺失，费用是向上取整的整数，文本里的书名是汉字，生成器不会被当成唯一的存档，包装不会偷走函数名。这些都已经在各自的章节里单独失败过。放在一起时，失败的方式不该变。

写这种脚本的顺序，建议按数据走，而不是按语法清单走。先定架子的字典长什么样，键用索书号。再定条子上有哪些字段，字段都是不可变的字符串和整数，避免类属性上的列表。然后写 lend 的失败方式，用异常。然后写费用，用整数或 ceil。然后写 report，用 json。最后才考虑要不要生成器和装饰器。生成器和装饰器是走法和包装，不是数据本身。数据形状错了，包装只会让错的形状跑得更难认。

当班脚本还要避免把输入散落在底层。读者名从最外层读入，读入的是字符串。若还要读天数，再单独读一行，并用 int 转换。转换失败是 ValueError，和索书号不存在的 KeyError 分开接。两种失败的句子不该都叫缺失。缺失是架子上没有这个号，天数不对是条子还没开始写。分开接，已经借出的那些才不会被第二次失败清掉。清掉名单应当是你显式写的动作，不是异常的副作用。

报告文本的字段顺序尽量固定。字典按插入顺序写出读者、书、费用。不要在报告里加上当前时间。时间会让同一份脚本每次运行的文本都不同，核对就只能靠人眼。这门课的核对靠期望子串，子串必须稳定。费用是整数 2，书名是小径，这两样足够证明 math 和 json 都走通了。需要更多字段时，加字段，而不是加时钟。

同一份脚本里不要既 return 空串又 raise。lend 只 raise。最外层把 KeyError 翻译成「缺失」再决定要不要继续下一本。继续下一本时用循环，循环包在 try 的外面或里面要看你的意图：包在外面，一本失败就停止后面的；包在里面，一本失败只跳过这一本。东柜的练习数据只有一个非法号，两种包法的差别在号变多时才显现。现在把 try 写在单次借出的旁边，是「这一本失败不影响已经成功的上一本」。上一本已经在 out 里，异常没有把它弹出。

生成器 owing 不复制条子。调用者若改了 yield 出来的费用，列表里的那张也会变。报告若在修改之后才 dumps，文本里就是改过的费用。若你希望报告保留登记时的费用，就在修改之前先 report，或者让 owing 交出只读的信息，例如读者名和费用的数字副本，而不是交出 Slip 本身。数字副本是整数，重新绑定不会改原条子。交出整个 Slip 则是交出可变对象。脚本变长时，这个差别比装饰器更先咬人。

包装 lend 时不要把 json 写在包装里。包装负责转发或记录名字，报告仍由 Desk.report 产生。把文本输出塞进每一层包装，你会在一次借出里印出好几段 json，期望虽然可能因为子串而通过，馆员却会看见重复的借条。通过的测试不等于条子只印了一次。看完整输出，数一数书名出现了几次。

脚本的最后应当让进程自己结束。不要写一个等下一本输入的无限循环来模拟全天当班。全天当班在这门课里会变成需要手动停止的进程，和死循环属于同一类。示例只处理写明的那一两本，处理完就打印报告并退出。退出码保持为 0 的条件是：缺失的号已经被接住，天数若存在则已经转成整数，没有任何列表被拿去当字典的键。这样一份脚本才能被反复运行，每次仍是新进程，架子都从源码里的那两本书重新开始，不会记住你上一次借出了小径。

## 小结

一份当班脚本在同一次进程里持有架子和借出列表。列表做在实例上，键用索书号。找不到就在 append 之前抛出 KeyError。费用用 math.ceil 收成整数再放进条子。json 只接收字典，汉字用 ensure_ascii=False。催还用生成器扫列表，不把列表换成只能走一遍的生成器。若要包装方法，用 functools.wraps 保住 lend 这个名字。

## 练习

做一个只有夜航、索书号 `K837/09` 的柜台，借给周予，费用传入 1。打印条子的书名。

::: answer 参考答案：借出夜航
```python run expect="夜航" title="参考答案"
class Slip:
    def __init__(self, reader, book, fee):
        self.reader = reader
        self.book = book
        self.fee = fee

class Desk:
    def __init__(self):
        self.shelf = {"K837/09": "夜航"}
        self.out = []

    def lend(self, call, reader, fee):
        slip = Slip(reader, self.shelf[call], fee)
        self.out.append(slip)
        return slip

print(Desk().lend("K837/09", "周予", 1).book)
```
:::

单价 0.4，天数 3，用 math.ceil 得到费用，放进字典，dumps 后再读出 fee 打印。

::: answer 参考答案：费用进文本
```python run expect="2" title="参考答案"
import json
import math
fee = math.ceil(0.4 * 3)
text = json.dumps({"fee": fee}, ensure_ascii=False)
print(json.loads(text)["fee"])
```
:::
