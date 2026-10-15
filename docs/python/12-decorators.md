---
language: python
chapter: 12
title: "装饰器与上下文管理器"
level: advanced
minutes: 18
goals:
  - "用闭包记住外层变量"
  - "用装饰器包住函数"
  - "用 with 管理进入和离开"
sources:
  - lxiy-python
  - byte-of-python
  - python-tutorial
updated: "2026-10-15"
---

装饰器是「接收函数、返回函数」的函数。`@twice` 写在 def 上面，等价于 `inc = twice(inc)`。

`with` 会调用对象的 `__enter__` 和 `__exit__`。适合成对出现的动作：打开然后一定关闭。这里不碰真实文件，只用打印把顺序展示出来。

```python run expect="3" title="调用两次"
def twice(fn):
    def inner(x):
        return fn(fn(x))
    return inner

@twice
def inc(n):
    return n + 1

print(inc(1))
```

```python run expect="55" title="缓存"
def cache(fn):
    saved = {}
    def inner(n):
        if n not in saved:
            saved[n] = fn(n)
        return saved[n]
    return inner

@cache
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(10))
```

```python run expect="open\nin\nclose" title="with"
class Box:
    def __enter__(self):
        print("open")
        return self

    def __exit__(self, exc_type, exc, tb):
        print("close")
        return False

with Box():
    print("in")
```

装饰器是「接收函数、返回函数」的函数。@decorator 写在 def 上面，等价于在定义之后立刻 func = decorator(func)。因此装饰器在函数定义时就执行，不是等到调用时。要给每次调用加行为，就在装饰器内部再定义一个 wrapper，由 wrapper 去调用原函数。

wrapper 应该使用 functools.wraps，把原函数的名字和文档字符串拷过来。否则帮助文本和错误栈里全是 wrapper，不好查。参数用 *args 和 **kwargs 原样转交，这样被装饰的函数无论有几个参数都能用。

带参数的装饰器是三层函数：最外层接收装饰参数，中间层接收函数，内层才是每次调用。读的时候从内往外看「谁在调用谁」。如果只是想在调用前后打印，两层就够，不要为了形式凑成三层。

装饰器适合横切的小事：计时、记日志、检查权限、缓存结果。不适合把业务分支藏进去。读代码的人会先看函数体，如果主要逻辑在装饰器里，函数体就会显得空。缓存用 functools.lru_cache 或自己的字典都可以，参数必须可哈希。

装饰器在 def 执行时运行，所以它的外层代码不能依赖函数被调用时才有的数据。需要每次调用的信息，放在 wrapper 的参数里。打印「函数被定义了」可以放在装饰器外层，打印「函数被调用了」必须放在 wrapper 里。

wraps 拷贝的是元数据，不是函数体。它让 help 和 __name__ 好看。忘记 wraps 不会让结果算错，但栈里全是 wrap，本章后面的例子如果变复杂，你会想把它加回去。

多个装饰器叠在一起时，靠近 def 的先应用。@a @b def f 等价于 f = a(b(f))。顺序错了，日志和缓存谁先谁后就会反。教学例子一次只用一个装饰器。

缓存装饰器的参数必须能放进字典当键。列表当参数会失败。先把列表收成元组再缓存，或者干脆不用缓存，本章的计数器只记录调用次数，不缓存返回值，因此没有这个限制。

装饰器是接收函数并返回函数的函数。写在 def 上面的 @ 等价于定义之后立刻用装饰器包一次。因此装饰器的外层在函数定义时就执行，不是等到调用。要在每次调用时加行为，必须在内部再定义 wrapper，由 wrapper 去调用原函数。定义时的打印和调用时的打印不在同一层，读代码先分清这两层。

wrapper 应该接住任意参数并原样转交，这样被装饰的函数无论有几个参数都能用。需要保留原函数的名字和文档时，用 functools.wraps。否则错误栈里全是 wrapper，不好查。带参数的装饰器是三层：最外层接收装饰参数，中间层接收函数，内层才是每次调用。只是想在调用前后做一点事时，两层就够，不要为了形式凑成三层。

装饰器适合计时、计数、缓存这类横切的小事。主要业务仍留在函数体里。读代码的人会先看函数体，逻辑若藏在装饰器里，函数体就会显得空。缓存的参数必须可哈希。循环里给大量函数套装饰器时，确认装饰器没有在定义阶段做昂贵的工作。

恒等装饰器直接返回原函数，用来对照「包一层」和「不包」的差别。计数装饰器把次数放在 wrapper 的属性上，打印的是调用次数，不是函数的返回值。不要把这两件输出混在同一次期望里。

### 读「调用次数」

先做这一例。代码收成一行是 `def count(fn): def wrap(n): wrap.calls += 1 return fn(n) wrap.calls = 0 return wrap @count def inc(n): return n + 1 inc(1) inc(1) print(inc.calls)`。先盖住终端，用手算结果，纸上的文本里要能找到「2」。这是子串：前面可以有别的输出，后面通常有换行，不要要求整屏只有这几个字。

然后点这个代码块上的 Run，不要点工具栏。代码块会先备份草稿，再把示例写进编辑器并执行。终端里用眼睛找「2」。退出码不是 0 时，先读错误的类型和最后一行，此时不要改期望。退出码是 0 但找不到这段文字，说明打印了别的值，回到产生该值的表达式，只改一处。

改过之后再点代码块上的 Run，会把你的修改盖掉。要验证修改，点工具栏上的 Run。预测和新输出一致后，点撤销，把草稿还给自己。一次只改这一例，不要连着改两个代码块。

### 读「恒等装饰」

做完上一个再做这一例。代码收成一行是 `def same(fn): return fn @same def value(): return 7 print(value())`。先盖住终端，用手算结果，纸上的文本里要能找到「7」。这是子串：前面可以有别的输出，后面通常有换行，不要要求整屏只有这几个字。

然后点这个代码块上的 Run，不要点工具栏。代码块会先备份草稿，再把示例写进编辑器并执行。终端里用眼睛找「7」。退出码不是 0 时，先读错误的类型和最后一行，此时不要改期望。退出码是 0 但找不到这段文字，说明打印了别的值，回到产生该值的表达式，只改一处。

改过之后再点代码块上的 Run，会把你的修改盖掉。要验证修改，点工具栏上的 Run。预测和新输出一致后，点撤销，把草稿还给自己。一次只改这一例，不要连着改两个代码块。

实践 1 写成一句就是：用 functools.wraps 保留原函数的名字。 用「调用次数」当检查对象。删掉一个保护条件，或把比较符号反过来，看失败是报错还是静默地打出另一个数。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：结果加一」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

实践 2 写成一句就是：装饰器只添加横切行为，不把主要业务藏进去。 用「恒等装饰」当检查对象。把本该新建的对象改成复用已有的名字，看两个名字会不会一起变。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：结果加一」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

实践 3 写成一句就是：需要参数的装饰器再加一层，并且先用打印确认每一层何时执行。 用「调用次数」当检查对象。少写一个边界：少一次循环、少一个参数或少接住一个返回值，看输出正好差在哪。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：结果加一」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

练习先不看折叠答案。题目是：写一个装饰器，把函数的返回值加 1。用它装饰一个返回 41 的函数并打印。 做完再对照「参考答案：结果加一」。能说出自己的写法和答案差在哪一行，这道题才算完成。本章的另一道练习查的不是同一件事，两道都做。

收束时用一句话复述：装饰器在定义时包住函数，真正的额外行为放在内部 wrapper 里，并在调用时转交参数。 若只能留下三句，就留下上面三条实践，并为每一条记住一个你刚刚故意做错的反例。

```python run expect="2" title="调用次数"
def count(fn):
    def wrap(n):
        wrap.calls += 1
        return fn(n)
    wrap.calls = 0
    return wrap

@count
def inc(n):
    return n + 1

inc(1)
inc(1)
print(inc.calls)
```

```python run expect="7" title="恒等装饰"
def same(fn):
    return fn

@same
def value():
    return 7
print(value())
```

## 练习

写一个装饰器 `shout`，让函数的字符串返回值变成大写。

::: answer 参考答案：大写装饰器
```python run expect="HELLO" title="参考答案"
def shout(fn):
    def inner():
        return fn().upper()
    return inner

@shout
def greet():
    return "hello"

print(greet())
```
:::

写一个装饰器，把函数的返回值加 1。用它装饰一个返回 41 的函数并打印。

::: answer 参考答案：结果加一
```python run expect="42" title="参考答案"
def plus_one(fn):
    def wrap():
        return fn() + 1
    return wrap

@plus_one
def answer():
    return 41
print(answer())
```
:::

## 最佳实践

- 用 functools.wraps 保留原函数的名字。
- 装饰器只添加横切行为，不把主要业务藏进去。
- 需要参数的装饰器再加一层，并且先用打印确认每一层何时执行。

## 小结

装饰器在定义时包住函数，真正的额外行为放在内部 wrapper 里，并在调用时转交参数。

## 常见错误

- 装饰器里忘记 return inner。被装饰的名字会变成 None。
- __exit__ 返回 True 会把异常吞掉。只有确实处理了错误才返回真。

## 延伸阅读

- [The Python Tutorial](https://docs.python.org/3/tutorial/)（PSF，仅链接）
- [Think Python 3e](https://greenteapress.com/wp/think-python-3rd-edition/)（CC BY-NC-SA，仅链接）
- [Automate the Boring Stuff with Python](https://automatetheboringstuff.com/)（CC BY-NC-SA，仅链接）

## 参考与致谢

正文为原创。示例的知识点范围参考了 Learn X in Y minutes — Python（CC BY-SA 3.0）与 A Byte of Python（CC BY-SA 4.0），没有逐字搬用原文。
