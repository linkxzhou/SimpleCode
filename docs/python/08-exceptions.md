---
language: python
chapter: 8
title: "异常处理"
level: intermediate
minutes: 18
goals:
  - "用 try / except 接住失败"
  - "用 finally 做收尾"
  - "抛出自己的异常类型"
sources:
  - lxiy-python
  - byte-of-python
  - python-tutorial
updated: "2026-10-15"
---

异常是一种控制流：出错的地方 `raise`，愿意处理的地方 `except`。只接住你准备处理的类型，不要写裸的 `except:`。

`finally` 无论是否出错都会执行。自定义异常继承 `Exception`，这样调用者可以按类型区分。

```python run expect="5.0" title="安全除法"
def divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return "undefined"

print(divide(10, 2))
print(divide(1, 0))
```

```python run expect="空白" title="自定义异常"
class EmptyInput(Exception):
    pass

def parse(text):
    if text.strip() == "":
        raise EmptyInput("空白")
    return int(text)

try:
    parse("  ")
except EmptyInput as err:
    print(err)
```

```python run expect="bad" title="非零退出" exit="2"
import sys
print("bad")
sys.exit(2)
```

异常用来报告「这一步无法按约定完成」。raise 抛出，try 围住可能失败的代码，except 按类型接住。可以写多个 except，更具体的类型放在前面，因为解释器按书写顺序匹配，前面的父类会把子类也接住。except Exception 几乎什么都接，调试时会把真正的缺陷藏起来。不要写裸的 except:。

else 子句在 try 没有异常时运行，finally 无论是否异常都会运行，适合释放资源。文件用 with 打开时，离开块会自动关闭，通常不必再写 finally。异常不是另一种 if：能事先判断的情况（键在不在、除数是不是零）用条件更清楚；解析用户输入这种「格式错了才知道」的情况适合 try。

自定义异常继承 Exception，名字以 Error 结尾。调用方就可以 except 你的类型，而不是去读错误消息的文字。消息是给人看的，类型才是给程序分支用的。

traceback 从上到下是调用栈。最后一行是异常类型和消息，往上是谁调用了谁。修 bug 时先看最后一行，再看你自己的文件，跳过标准库内部的帧。这个环境的报错同样会进终端，退出码非零。

try 里面放可能失败的最少代码。如果把整个函数都包进去，except 会接住不该接的错误，例如名字写错导致的 NameError。那样你会以为是输入坏了，其实是自己的变量名。

异常对象可以带消息。str(err) 或 err 本身打印出来就是消息。不要靠消息的全文做分支，消息会改；用异常类型，或者在自定义异常上放一个稳定的属性。

finally 里再抛异常会盖住原来的异常。清理代码保持简单，不要在 finally 里解析数据。with 语句能处理的资源就不要手写 finally。

自定义异常类的主体可以只有 pass。继承 Exception 已经足够被 except 匹配。如果还需要错误码，在 __init__ 里保存，并调用 super().__init__(message)，这样打印时仍有文字。

异常表示这一步无法按约定完成。raise 抛出，try 围住可能失败的最少代码，except 按类型接住。多个 except 更具体的写在前面，因为匹配按书写顺序，父类会把子类也接住。except Exception 几乎什么都接，名字写错这种缺陷也会被当成输入错误。不要写不带类型的 except。

else 在 try 没有异常时运行，适合放「只有成功才继续」的语句。finally 无论是否异常都会运行。finally 里再抛异常会盖住原来的异常，所以清理代码保持简单。文件和锁优先用 with，离开块自动释放，不必在每条路径上手写 close。

能事先判断的情况用 if：键在不在、除数是不是零。解析用户输入这种「格式错了才知道」的情况适合 try。不要为了演示捕获而把正常分支改成抛异常。自定义异常继承 Exception，名字以 Error 结尾，需要的错误码放在属性上，并调用父类初始化，这样打印时仍有文字。分支看类型，不看消息全文，因为消息会改。

traceback 最后一行是类型和消息，往上是调用关系。先看最后一行，再看你自己的文件，跳过标准库内部的帧。这个环境的报错同样进终端，退出码非零。

### 读「else 子句」

先做这一例。代码收成一行是 `try: value = 1 except ZeroDivisionError: print('bad') else: print(value)`。先盖住终端，用手算结果，纸上的文本里要能找到「1」。这是子串：前面可以有别的输出，后面通常有换行，不要要求整屏只有这几个字。

然后点这个代码块上的 Run，不要点工具栏。代码块会先备份草稿，再把示例写进编辑器并执行。终端里用眼睛找「1」。退出码不是 0 时，先读错误的类型和最后一行，此时不要改期望。退出码是 0 但找不到这段文字，说明打印了别的值，回到产生该值的表达式，只改一处。

改过之后再点代码块上的 Run，会把你的修改盖掉。要验证修改，点工具栏上的 Run。预测和新输出一致后，点撤销，把草稿还给自己。一次只改这一例，不要连着改两个代码块。

### 读「类型匹配」

做完上一个再做这一例。代码收成一行是 `try: raise ValueError('x') except TypeError: print('type') except ValueError: print('value')`。先盖住终端，用手算结果，纸上的文本里要能找到「value」。这是子串：前面可以有别的输出，后面通常有换行，不要要求整屏只有这几个字。

然后点这个代码块上的 Run，不要点工具栏。代码块会先备份草稿，再把示例写进编辑器并执行。终端里用眼睛找「value」。退出码不是 0 时，先读错误的类型和最后一行，此时不要改期望。退出码是 0 但找不到这段文字，说明打印了别的值，回到产生该值的表达式，只改一处。

改过之后再点代码块上的 Run，会把你的修改盖掉。要验证修改，点工具栏上的 Run。预测和新输出一致后，点撤销，把草稿还给自己。一次只改这一例，不要连着改两个代码块。

实践 1 写成一句就是：except 写出具体类型，并且更具体的写在前面。 用「else 子句」当检查对象。删掉一个保护条件，或把比较符号反过来，看失败是报错还是静默地打出另一个数。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：接住 ValueError」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

实践 2 写成一句就是：能用条件判断的失败不要故意抛异常再接住。 用「类型匹配」当检查对象。把本该新建的对象改成复用已有的名字，看两个名字会不会一起变。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：接住 ValueError」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

实践 3 写成一句就是：清理资源优先用 with，而不是记得在每条路径上 close。 用「else 子句」当检查对象。少写一个边界：少一次循环、少一个参数或少接住一个返回值，看输出正好差在哪。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：接住 ValueError」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

练习先不看折叠答案。题目是：把字符串 no 转成整数，失败时打印「失败」。 做完再对照「参考答案：接住 ValueError」。能说出自己的写法和答案差在哪一行，这道题才算完成。本章的另一道练习查的不是同一件事，两道都做。

收束时用一句话复述：异常按类型捕获，finally 和 with 负责清理。用户输入的格式错误适合 try，程序里的正常分支仍用 if。 若只能留下三句，就留下上面三条实践，并为每一条记住一个你刚刚故意做错的反例。

```python run expect="1" title="else 子句"
try:
    value = 1
except ZeroDivisionError:
    print('bad')
else:
    print(value)
```

```python run expect="value" title="类型匹配"
try:
    raise ValueError('x')
except TypeError:
    print('type')
except ValueError:
    print('value')
```

## 练习

读入一行，能转成整数就打印它，否则打印「不是整数」。

::: answer 参考答案：解析整数
```python run stdin="3.14\n" expect="不是整数" title="参考答案"
try:
    print(int(input()))
except ValueError:
    print("不是整数")
```
:::

把字符串 no 转成整数，失败时打印「失败」。

::: answer 参考答案：接住 ValueError
```python run expect="失败" title="参考答案"
try:
    print(int("no"))
except ValueError:
    print("失败")
```
:::

## 最佳实践

- except 写出具体类型，并且更具体的写在前面。
- 能用条件判断的失败不要故意抛异常再接住。
- 清理资源优先用 with，而不是记得在每条路径上 close。

## 小结

异常按类型捕获，finally 和 with 负责清理。用户输入的格式错误适合 try，程序里的正常分支仍用 if。

## 常见错误

- 用异常代替普通的 if。找不到键可以先用 in 判断，不必每次 KeyError。
- except Exception 把 KeyboardInterrupt 以外几乎所有错误都吞掉，真实的缺陷会被藏住。

## 延伸阅读

- [The Python Tutorial](https://docs.python.org/3/tutorial/)（PSF，仅链接）
- [Think Python 3e](https://greenteapress.com/wp/think-python-3rd-edition/)（CC BY-NC-SA，仅链接）
- [Automate the Boring Stuff with Python](https://automatetheboringstuff.com/)（CC BY-NC-SA，仅链接）

## 参考与致谢

正文为原创。示例的知识点范围参考了 Learn X in Y minutes — Python（CC BY-SA 3.0）与 A Byte of Python（CC BY-SA 4.0），没有逐字搬用原文。
