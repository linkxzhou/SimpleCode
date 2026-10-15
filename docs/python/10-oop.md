---
language: python
chapter: 10
title: "面向对象"
level: intermediate
minutes: 18
goals:
  - "定义类和构造方法"
  - "用继承复用行为"
  - "用 dataclass 少写样板"
sources:
  - lxiy-python
  - byte-of-python
  - python-tutorial
updated: "2026-10-15"
---

类把数据和操作放在一起。`__init__` 初始化实例属性。方法的第一个参数是实例自己，习惯叫 `self`。

子类可以覆盖方法。`dataclass` 会按字段自动生成初始化方法和可读的 `repr`。

```python run expect="Ada 125" title="账户"
class Account:
    def __init__(self, owner, balance):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount

acc = Account("Ada", 100)
acc.deposit(25)
print(acc.owner, acc.balance)
```

```python run expect="12" title="多态"
class Shape:
    def area(self):
        return 0

class Rect(Shape):
    def __init__(self, w, h):
        self.w = w
        self.h = h

    def area(self):
        return self.w * self.h

print(Rect(3, 4).area())
```

```python run expect="Point(x=1, y=2)" title="dataclass"
from dataclasses import dataclass

@dataclass
class Point:
    x: int
    y: int

print(Point(1, 2))
```

类把数据和操作放在一起。class 的套件里写方法和类属性。实例属性在 __init__ 里挂到 self 上，每个对象各有一份。类属性挂在类上，所有实例共享，适合当常量，不适合当「每个对象自己的计数」，因为一个实例改了，其他实例也会看见。

方法的第一个参数是实例，习惯叫 self。调用时不需要自己把实例传进去，点号会做这件事。没有 @staticmethod 的方法如果通过类来调用，就必须手动传入实例。继承时子类的方法覆盖父类的同名方法，super() 用来调用父类版本，避免把父类名字写死。

dataclass 根据字段生成 __init__、__repr__ 和比较方法，省掉重复的样板。字段可以带默认值，有默认值的字段必须写在没有默认值的字段后面，和函数参数一样。冻结的 dataclass 近似不可变，适合当字典的键。

对象的相等和身份不同。默认的 == 比的是是不是同一个对象。定义了 __eq__ 之后，== 才按你的字段比较。打印对象时如果没写 __repr__，你只会看到内存地址，调试时很痛苦，所以要么用 dataclass，要么写一个简短的 __repr__。

self 不是关键字，只是约定。你把它写成 this 也能运行，但别人读起来会停顿。保持 self。实例方法里忘记写 self，定义时不会报错，调用时才会说参数个数不对。

继承的方法查找沿父类链向上。子类没有的方法用父类的。子类有的方法完全取代父类的，不会自动先调用父类。需要父类逻辑时写 super().method(...)。多重继承本教程不展开，单继承足够把「复用」讲清楚。

dataclass 的字段顺序就是构造参数的顺序。比较两个 dataclass 默认比较所有字段。如果不希望某个字段参与比较，可以在字段上标记，本章例子用不到就保持默认。

类属性被实例赋值会变成实例属性，盖住类属性，但只对这个实例生效。Unit.name = "m" 是类上的；u = Unit(); u.name = "cm" 之后，u.name 是 cm，Unit.name 仍是 m。这常让人以为「改了一个，全部都变」。

类把数据和方法放在一起。实例属性在 __init__ 里挂到 self 上，每个对象各有一份。类属性挂在类上，所有实例共享，适合当不变的单位，不适合当「每个对象自己的计数」。一个实例给类属性赋值，绑定的是实例自己的名字；原地修改可变的类属性，则所有实例一起看见。

方法的第一个参数习惯叫 self。它不是关键字，写成别的名字也能跑，但读者会停顿。调用时点号会把实例传进去，你不要自己再传一次。忘记在定义里写 self，定义时往往不报错，调用时才说参数个数不对。继承时子类方法覆盖同名方法。还需要父类行为时调用 super()，避免把父类名字写死。

dataclass 根据字段生成初始化、可读输出和比较。有默认值的字段必须写在没有默认值的字段后面。默认的相等比较的是字段值，不是身份。没写可读输出的普通类，打印时只看到地址，调试时先补一个简短的 __repr__，或直接用 dataclass。

相等和身份不是一回事。is 问是不是同一个对象，== 在你定义了比较方法之后问值是否一样。需要当字典键的对象要可哈希；可变对象不要拿去当键。

### 读「类属性」

先做这一例。代码收成一行是 `class Unit: name = "m" print(Unit().name)`。先盖住终端，用手算结果，纸上的文本里要能找到「m」。这是子串：前面可以有别的输出，后面通常有换行，不要要求整屏只有这几个字。

然后点这个代码块上的 Run，不要点工具栏。代码块会先备份草稿，再把示例写进编辑器并执行。终端里用眼睛找「m」。退出码不是 0 时，先读错误的类型和最后一行，此时不要改期望。退出码是 0 但找不到这段文字，说明打印了别的值，回到产生该值的表达式，只改一处。

改过之后再点代码块上的 Run，会把你的修改盖掉。要验证修改，点工具栏上的 Run。预测和新输出一致后，点撤销，把草稿还给自己。一次只改这一例，不要连着改两个代码块。

### 读「repr」

做完上一个再做这一例。代码收成一行是 `class Point: def __init__(self, x): self.x = x def __repr__(self): return f"Point({self.x})" print(Point(3))`。先盖住终端，用手算结果，纸上的文本里要能找到「Point(3)」。这是子串：前面可以有别的输出，后面通常有换行，不要要求整屏只有这几个字。

然后点这个代码块上的 Run，不要点工具栏。代码块会先备份草稿，再把示例写进编辑器并执行。终端里用眼睛找「Point(3)」。退出码不是 0 时，先读错误的类型和最后一行，此时不要改期望。退出码是 0 但找不到这段文字，说明打印了别的值，回到产生该值的表达式，只改一处。

改过之后再点代码块上的 Run，会把你的修改盖掉。要验证修改，点工具栏上的 Run。预测和新输出一致后，点撤销，把草稿还给自己。一次只改这一例，不要连着改两个代码块。

实践 1 写成一句就是：每个对象自己的数据放在 self 上，不要放在类体里当可变类属性。 用「类属性」当检查对象。删掉一个保护条件，或把比较符号反过来，看失败是报错还是静默地打出另一个数。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：两倍宽」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

实践 2 写成一句就是：需要可读输出时写 __repr__，或直接用 dataclass。 用「repr」当检查对象。把本该新建的对象改成复用已有的名字，看两个名字会不会一起变。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：两倍宽」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

实践 3 写成一句就是：覆盖方法后如果还要父类行为，显式调用 super()。 用「类属性」当检查对象。少写一个边界：少一次循环、少一个参数或少接住一个返回值，看输出正好差在哪。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：两倍宽」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

练习先不看折叠答案。题目是：定义一个只有 width 的类，方法 area 返回 width 乘 2，打印 width 为 5 的结果。 做完再对照「参考答案：两倍宽」。能说出自己的写法和答案差在哪一行，这道题才算完成。本章的另一道练习查的不是同一件事，两道都做。

收束时用一句话复述：类用 self 保存每个对象的数据，继承用覆盖和 super 复用行为。dataclass 减少样板，相等和身份不是一回事。 若只能留下三句，就留下上面三条实践，并为每一条记住一个你刚刚故意做错的反例。

```python run expect="m" title="类属性"
class Unit:
    name = "m"
print(Unit().name)
```

```python run expect="Point(3)" title="repr"
class Point:
    def __init__(self, x):
        self.x = x
    def __repr__(self):
        return f"Point({self.x})"
print(Point(3))
```

## 练习

写一个 `Circle`，`area` 返回 `3 * r * r`（不用圆周率，方便核对），打印半径 3 的面积。

::: answer 参考答案：圆形
```python run expect="27" title="参考答案"
class Circle:
    def __init__(self, r):
        self.r = r

    def area(self):
        return 3 * self.r * self.r

print(Circle(3).area())
```
:::

定义一个只有 width 的类，方法 area 返回 width 乘 2，打印 width 为 5 的结果。

::: answer 参考答案：两倍宽
```python run expect="10" title="参考答案"
class Line:
    def __init__(self, width):
        self.width = width
    def span(self):
        return self.width * 2
print(Line(5).span())
```
:::

## 最佳实践

- 每个对象自己的数据放在 self 上，不要放在类体里当可变类属性。
- 需要可读输出时写 __repr__，或直接用 dataclass。
- 覆盖方法后如果还要父类行为，显式调用 super()。

## 小结

类用 self 保存每个对象的数据，继承用覆盖和 super 复用行为。dataclass 减少样板，相等和身份不是一回事。

## 常见错误

- 忘记 self。实例方法的第一个参数必须接收对象本身。
- 在类体里用可变默认值当全体实例共享的名单，却以为每人一份。

## 延伸阅读

- [The Python Tutorial](https://docs.python.org/3/tutorial/)（PSF，仅链接）
- [Think Python 3e](https://greenteapress.com/wp/think-python-3rd-edition/)（CC BY-NC-SA，仅链接）
- [Automate the Boring Stuff with Python](https://automatetheboringstuff.com/)（CC BY-NC-SA，仅链接）

## 参考与致谢

正文为原创。示例的知识点范围参考了 Learn X in Y minutes — Python（CC BY-SA 3.0）与 A Byte of Python（CC BY-SA 4.0），没有逐字搬用原文。
