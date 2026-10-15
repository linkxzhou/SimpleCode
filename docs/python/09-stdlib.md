---
language: python
chapter: 9
title: "模块与标准库"
level: intermediate
minutes: 18
goals:
  - "导入 math、datetime、itertools"
  - "固定随机序列"
  - "只用标准库完成小计算"
sources:
  - lxiy-python
  - byte-of-python
  - python-tutorial
updated: "2026-10-15"
---

`import` 只在当前进程里生效，而且这里没有 pip。日期、数学、排列这些常见需求，标准库已经够用。

`datetime.date` 做日历运算不需要时区数据。`itertools.islice` 可以从无限计数器里只取前几项。

```python run expect="14" title="日期差"
from datetime import date
start = date(2026, 10, 1)
end = date(2026, 10, 15)
print((end - start).days)
```

```python run expect="12" title="math"
import math
print(math.gcd(24, 36))
print(round(math.sqrt(2), 3))
```

```python run expect="[1, 2, 3]" title="itertools"
import itertools
print(list(itertools.islice(itertools.count(1), 3)))
print(list(itertools.product("AB", "12")))
```

import 把另一个模块的名字引进当前文件。import math 之后用 math.gcd，from math import gcd 则直接写 gcd。后者写起来短，但同名函数一多就不知道它来自哪里。教程里的示例尽量写全模块名，读代码时不用来回找。

导入只在这一次进程里有效。你不能 import 一个还没写到磁盘上的自己的第二文件来跨次运行，因为进程结束文件系统就清空了。标准库是例外：它跟解释器走，不需要你事先创建文件。math、datetime、itertools、random、json、pathlib 这些是本章的范围。

datetime.date 做日历差，不涉及时区数据库。timedelta 的 days 是整数。math.gcd 求最大公约数，math.sqrt 返回 float，拿来和期望输出比较时先 round，避免出现很长的小数尾巴。itertools 提供惰性的计数器、排列和切片，适合「不要一次生成无限序列」。

随机模块和上一章的种子约定相同。json 模块可以把字典收成文本再读回来，键会变成字符串。pathlib 在这一次运行里能创建临时路径，不要假设下一轮 Run 还能看见那个文件。

from datetime import date 只拿出 date 这个名字。模块里其他名字不会进来。这能避免 datetime 这个名字同时表示模块和类时的混淆。教程里两种写法都会见到，读代码时先看 import 那几行。

math.sqrt(2) 的二进制小数很长。round(x, 3) 返回的仍是 float，打印时通常是短的，但不要拿它和字符串 "1.414" 做 ==，先决定比数字还是比文本。本章打印 round 的结果，期望子串用短的小数。

itertools.count 是无限的。list() 它会一直跑下去，直到内存或时间耗尽。islice 负责切前 n 项。任何「生成器配 list」之前都先问：这个生成器会不会停？

json 不认识元组，会把它收成列表；不认识 set。dumps 之前先换成列表或字典。键必须是字符串，数字键会在 dumps 时变成字符串，loads 之后不要指望还是 int。

import math 之后用 math.gcd，from math import gcd 则直接写 gcd。后者短，但同名一多就不知道来自哪里。教程尽量写全模块名。import * 会把来源藏起来，本章不用。导入只在这一次进程里有效。你不能指望下一轮 Run 还能看见上一轮创建的模块文件，标准库是例外，它跟解释器走。

math.sqrt 得到的浮点数很长。round 之后仍然是 float，打印时通常变短，但不要拿它和字符串做相等比较。先决定比数字还是比文本。本章把 round 的结果打印出来，期望用短的小数子串。gcd 的结果是整数，适合直接打印。

datetime.date 做日历差，不依赖时区数据库。timedelta 的 days 是整数。itertools 里有无限计数器，对它 list() 会一直跑。先问这个生成器会不会停，再用 islice 只取前几项。json 不认识元组和集合，dumps 之前换成列表或字典。数字键在 dumps 时会变成字符串，loads 之后不要指望还是 int。键必须是字符串。

pathlib 能在这一次运行里创建路径。下一轮 Run 不要再读那个文件。随机数仍遵守固定种子的约定，不要在标准库示例里突然改用全局随机源。

### 读「四舍五入开方」

先做这一例。代码收成一行是 `import math print(round(math.sqrt(2), 2))`。先盖住终端，用手算结果，纸上的文本里要能找到「1.41」。这是子串：前面可以有别的输出，后面通常有换行，不要要求整屏只有这几个字。

然后点这个代码块上的 Run，不要点工具栏。代码块会先备份草稿，再把示例写进编辑器并执行。终端里用眼睛找「1.41」。退出码不是 0 时，先读错误的类型和最后一行，此时不要改期望。退出码是 0 但找不到这段文字，说明打印了别的值，回到产生该值的表达式，只改一处。

改过之后再点代码块上的 Run，会把你的修改盖掉。要验证修改，点工具栏上的 Run。预测和新输出一致后，点撤销，把草稿还给自己。一次只改这一例，不要连着改两个代码块。

### 读「JSON 往返」

做完上一个再做这一例。代码收成一行是 `import json print(json.loads(json.dumps({"n": 42}))["n"])`。先盖住终端，用手算结果，纸上的文本里要能找到「42」。这是子串：前面可以有别的输出，后面通常有换行，不要要求整屏只有这几个字。

然后点这个代码块上的 Run，不要点工具栏。代码块会先备份草稿，再把示例写进编辑器并执行。终端里用眼睛找「42」。退出码不是 0 时，先读错误的类型和最后一行，此时不要改期望。退出码是 0 但找不到这段文字，说明打印了别的值，回到产生该值的表达式，只改一处。

改过之后再点代码块上的 Run，会把你的修改盖掉。要验证修改，点工具栏上的 Run。预测和新输出一致后，点撤销，把草稿还给自己。一次只改这一例，不要连着改两个代码块。

实践 1 写成一句就是：优先 import 模块而不是 import *，避免名字不知道从哪来。 用「四舍五入开方」当检查对象。删掉一个保护条件，或把比较符号反过来，看失败是报错还是静默地打出另一个数。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：gcd」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

实践 2 写成一句就是：浮点结果先 round 再比较或打印固定位数。 用「JSON 往返」当检查对象。把本该新建的对象改成复用已有的名字，看两个名字会不会一起变。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：gcd」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

实践 3 写成一句就是：只使用标准库，第三方需求改成只读说明。 用「四舍五入开方」当检查对象。少写一个边界：少一次循环、少一个参数或少接住一个返回值，看输出正好差在哪。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：gcd」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

练习先不看折叠答案。题目是：用 math.gcd 打印 8 和 12 的最大公约数。 做完再对照「参考答案：gcd」。能说出自己的写法和答案差在哪一行，这道题才算完成。本章的另一道练习查的不是同一件事，两道都做。

收束时用一句话复述：标准库覆盖数学、日期、迭代工具和 JSON。导入在单次进程内有效，浮点输出要收成稳定的位数。 若只能留下三句，就留下上面三条实践，并为每一条记住一个你刚刚故意做错的反例。

```python run expect="1.41" title="四舍五入开方"
import math
print(round(math.sqrt(2), 2))
```

```python run expect="42" title="JSON 往返"
import json
print(json.loads(json.dumps({"n": 42}))["n"])
```

## 练习

用 `itertools.permutations` 打印 `"AB"` 的全部排列，每行一个。

::: answer 参考答案：排列
```python run expect="AB\nBA" title="参考答案"
import itertools
for item in itertools.permutations("AB"):
    print("".join(item))
```
:::

用 math.gcd 打印 8 和 12 的最大公约数。

::: answer 参考答案：gcd
```python run expect="4" title="参考答案"
import math
print(math.gcd(8, 12))
```
:::

## 最佳实践

- 优先 import 模块而不是 import *，避免名字不知道从哪来。
- 浮点结果先 round 再比较或打印固定位数。
- 只使用标准库，第三方需求改成只读说明。

## 小结

标准库覆盖数学、日期、迭代工具和 JSON。导入在单次进程内有效，浮点输出要收成稳定的位数。

## 常见错误

- import requests。这个环境没有第三方包，也没有网络。
- 依赖 random.random() 的具体小数。换版本可能变化，测试应比较同一颗种子的两次结果。

## 延伸阅读

- [The Python Tutorial](https://docs.python.org/3/tutorial/)（PSF，仅链接）
- [Think Python 3e](https://greenteapress.com/wp/think-python-3rd-edition/)（CC BY-NC-SA，仅链接）
- [Automate the Boring Stuff with Python](https://automatetheboringstuff.com/)（CC BY-NC-SA，仅链接）

## 参考与致谢

正文为原创。示例的知识点范围参考了 Learn X in Y minutes — Python（CC BY-SA 3.0）与 A Byte of Python（CC BY-SA 4.0），没有逐字搬用原文。
