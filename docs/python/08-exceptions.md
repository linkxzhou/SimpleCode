---
language: python
chapter: 8
title: "没找到时交回空串，还是当场说明"
level: intermediate
minutes: 26
goals:
  - "比较查找失败时返回空字符串和抛出异常"
  - "用 try 接住指定的异常并让进程仍然成功结束"
  - "在 finally 里做无论成败都要做的收尾"
sources:
  - lxiy-python
  - byte-of-python
updated: "2026-10-15"
---

东柜查一本书在哪一格。查得到，就交回柜名。查不到，有两种完全不同的做法。一种是交回空字符串，调用者自己判断空不空。另一种是抛出异常，调用者必须接住，否则进程失败。两种都能写进程序。它们的差别在于失败会不会伪装成一个普通的值。空字符串是普通的值，打印它得到一行空白，拼接它得到一张没有柜名的条子，条件里它还为假，于是和「没写柜名」走同一支。异常不是值，它打断调用，直到有人接住或进程结束。借书台若把「没有这本书」当成可以继续盖章的普通结果，空字符串很省事，也会让空白条子流出柜台。若没有这本书就根本不该继续，异常更诚实。

先看返回空字符串的查找。架子上只有小径在东柜。查海边，get 风格的写法交回空串。调用者用 `== ""` 判断，印出未找到。注意不要用真值草草分支却印出柜名本身：空串印出来是空的，测试会以为程序没说话。我们把判断的结果写成明确的四个字。

```python run expect="未找到" title="失败变成空字符串"
def find_shelf(title):
    shelf = {"小径": "东柜", "夜航": "西柜"}
    if title not in shelf:
        return ""
    return shelf[title]

found = find_shelf("海边")
if found == "":
    print("未找到")
else:
    print(found)
```

这个函数对调用者很温和。温和的代价是每一个调用点都要记得检查空串。漏掉检查的那个调用点会把空串嵌进 f-string，印出「位置：」后面什么都没有，退出码仍是 0。成功的进程加上空白的位置，是这种设计最难查的事故，因为没有任何回溯提醒你忘记了检查。你只能靠期望里的「未找到」或者靠人眼。人眼在条子变多之后会漏。

再看抛出。同一批架子，查不到就 raise KeyError。KeyError 是字典自己在键缺失时也会用的类型，这里我们主动抛，信息里带上书名，便于读回溯。调用者用 try 包住调用，except 只接 KeyError。接住之后打印类型名。进程成功，输出里有 KeyError。若删掉 try，进程会失败，期望对不上，终端里是回溯而不是我们打印的类型名。两种运行都值得在自己电脑上见一次。文章里的可运行块必须是接住的那一种，否则自动核对无法完成。

```python run expect="KeyError" title="失败改为抛出"
def find_shelf(title):
    shelf = {"小径": "东柜", "夜航": "西柜"}
    if title not in shelf:
        raise KeyError(title)
    return shelf[title]

try:
    print(find_shelf("海边"))
except KeyError as exc:
    print(type(exc).__name__)
```

except 后面写了类型，就只接这种。书名写错导致的 KeyError 会被接住；若函数里还有别的错误，例如在返回之前对 None 做下标，那是 TypeError，不会被这个 except 接住，进程仍然失败。这是好事。一个什么都接的 `except:` 或 `except Exception` 会把写错的名字、写错的缩进之外的运行错误也变成「未找到」。借书台就会用「没有这本书」去解释一切故障。范围窄的 except 是这个设计能用的前提。

raise 还可以不带新的类型，在 except 里把刚接住的异常再抛出去。当你只是记录一笔、并不想真正处理时，再抛出去是合理的。若你既打印了未找到，又再抛，调用者会看见两套说法。处理了就不要再抛；没处理就不要印成功。不要印完「已处理」再让进程失败，那会让人以为章已经盖了。

finally 里的语句无论 try 是否成功都会执行。它适合做收尾：把「查询结束」印出来，或者在真实系统里放开一把锁。收尾不该决定业务结果。下面这一块查得到小径，try 里印出东柜，finally 里印出台面已清空。两行都出现。若把查找改成海边，except 印出未找到，finally 仍然印出台面已清空。收尾不因为失败而跳过，这正是 finally 比「在 try 末尾和 except 末尾各写一遍」更不容易漏的原因。

```python run expect="台面已清空" title="成败都要收尾"
def find_shelf(title):
    shelf = {"小径": "东柜"}
    if title not in shelf:
        raise KeyError(title)
    return shelf[title]

try:
    print(find_shelf("小径"))
except KeyError:
    print("未找到")
finally:
    print("台面已清空")
```

输出先是东柜，然后是台面已清空。finally 若自己又抛出异常，原来的异常会被换成这个新的，调用者可能看不见真正的 KeyError。收尾应当是不容易失败的动作。打印一句话足够安全。不要在 finally 里再查一次可能缺失的键。

else 可以跟在 try 后面，表示「没有发生异常时执行」。它和 finally 不同。finally 总会执行；else 只在成功时执行。把「印出柜名之后的登记」放在 else 里，可以避免在失败路径上登记。这个结构比在 try 里写很长一串更清楚：try 里只放可能失败的那一句查找。本章的例子为了短，有时把 print 放在 try 里。规模变大时，try 的块越短越好，这样你知道被监视的是哪一句。

自定义异常是你自己的类型，继承 Exception。当 KeyError 太泛，既可能是字典用错了键，也可能是书不在架上，就可以定义 `class MissingBook(Exception):` 然后 raise MissingBook(title)。调用者 except MissingBook，就不会把别的 KeyError 一起接住。类型是给调用者分支用的，消息是给人读的。两者都写。这一章的可运行例子仍用 KeyError，因为架子本身就是字典，用它的异常类型最直接。自定义类型在你有多种失败需要分开处理时再引入，不要为了一本小径就造一整套异常家族。

返回空串和抛出还可以对同一本书放在一次进程里对照，但要写成两个函数，避免一个函数有时返回有时抛出却没有文档。一个函数若既可能返回空串又可能抛出，调用者两头都要防，这是最贵的接口。选一种。下面只是对照调用，不是鼓励一个函数脚踏两条船。空串那条印未找到，抛出那条印 KeyError。

```python run expect="未找到" title="两种失败并排"
def find_quiet(title):
    shelf = {"小径": "东柜"}
    return shelf[title] if title in shelf else ""

def find_loud(title):
    shelf = {"小径": "东柜"}
    if title not in shelf:
        raise KeyError(title)
    return shelf[title]

quiet = find_quiet("海边")
print("未找到" if quiet == "" else quiet)
try:
    find_loud("海边")
except KeyError as exc:
    print(type(exc).__name__)
```

两行输出：未找到，以及 KeyError。第一行证明空串被翻译成了人话；若翻译漏了，第一行会是空的，期望失败。第二行证明异常被接住。两行的顺序固定，因为没有循环也没有随机。

输入转换成整数时也会失败。读者在天数那一格填了「三」。int("三") 抛出 ValueError，不是 KeyError。接住 ValueError 才能说「天数不是整数」。把它接成 KeyError 的 except 不会生效。不同的失败用不同的类型，调用者才能说不同的句子。下面这一块不读取真正的 input，把「三」直接放进源码，这样失败稳定。若用 input，就要在代码块上准备 stdin，而且读者还可能输入别的。教材要的是 ValueError 这条路径。

```python run expect="ValueError" title="天数字样不对"
try:
    days = int("三")
    print(days)
except ValueError as exc:
    print(type(exc).__name__)
```

int 的失败不要用返回空串来模仿，除非整个程序的风格就是「转换函数不抛异常」。标准的 int 会抛。包一层去吞掉 ValueError 再返回空串，等于把上一节刚批评过的温和接口又盖在一个本来诚实的函数上。可以包，但要有理由，例如交互式输入要反复问。反复问的循环应当在 except 里提示再读，而不是返回空串让远处的代码去猜。

异常不是用来代替条件的日常分支。书在不在架上，若两个结果都常见，用条件返回柜名或一个明确的结果对象，代码会更直。异常的成本在于阅读时要记得跳转到 except，也在于把它用在循环的每一本上会把控制流扯碎。东柜若预期大多数查询都查得到，偶尔的缺失用异常可以接受。若一半的查询都会缺失，例如在一批读者自报的书名里查找，缺失是正常业务，返回值更合适。选择取决于失败算不算意外，不取决于哪种写法更「高级」。

不要捕获之后只写 pass。那是空串问题的异常版本：进程成功，信息消失。本章每一个 except 都把类型名或「未找到」印出来。印出来，失败才仍然可见。可见，才谈得上处理。

异常对象上还可以带书名。`raise KeyError(title)` 之后，except 里的 exc 转成字符串时通常能看到那个书名。我们在例子里只打印类型名，是为了让期望不依赖引号的样式。你在自己排查时可以打印 exc，看见是哪一本没有。不要只打印类型就以为信息已经够了。类型告诉你失败属于哪一类，参数告诉你是哪一条索书号。两者都要在真正的柜台日志里出现。教程的期望选类型名，是因为类型名跨版本更稳，不是因为书名不重要。

try 可以嵌套。内层接住 KeyError 并打印未找到，外层若再接 Exception，就不会再看见这个 KeyError，因为它已经被处理了。外层能看见的是内层没有接住的那些。把「未找到」处理在离查找最近的地方，把「柜台整体失败」留在外层，层次才清楚。全部堆在最外层的一个 except 里，你会分不清是哪一次查找失败。借书台一次当班要查好几本时，每查一本就近处理，已查到的那些才能留在名单上。最外层再失败，不该把已经成功的查找说成没发生，所以成功的结果要在异常抛出之前已经放进一个你还握着的列表里。

`else` 分支和 for 的 else 不是一回事。循环也有 else，它在循环没有被 break 时执行。try 的 else 在没有异常时执行。两个 else 都容易被读成「否则」，但一个是「没打断」，一个是「没失败」。这一章只使用 try 的 else 这个概念，不在例子里混进循环的 else，免得两套「否则」叠在同一段借书流程里。你若在别的代码里看见 for 后面跟着 else，先确认它不属于 try。读错分支会把「找到了」和「找完都没有」说反。

自定义异常的消息用中文也可以。`raise MissingBook("架上没有小径")` 然后在 except 里打印异常的字符串，输出就是这句中文。这样做时期望可以锁定中文句子。代价是你把给人看的句子写进了异常，调用者若还想自己组织句子，就会重复。类型给程序分支，消息给人看，调用者可以选择只看类型、自己写「未找到」。本章的例子走类型名，就是把句子的组织权留在 except 里，而不是留在 raise 里。两种都成立，不要两种各写一半又互相矛盾。

最后分清三层结果。函数正常 return 柜名，调用者接着盖章。函数 return 空串，调用者必须记得翻译成未找到，否则空白进入条子。函数 raise，调用者不写 try 则进程失败，写了匹配的 except 才能改口。三层里只有第一层能直接把返回值交进 json。后两层都需要一次翻译。翻译的位置要固定，不要有的调用点翻译、有的不翻译。

## 小结

返回空字符串时，每个调用点都要检查，漏查会印出空白位置且退出码为 0。raise 把失败从普通值里分开，调用者用窄的 except 接住指定类型。finally 无论成败都执行，适合收尾，不适合再做一次可能失败的查找。int 对非法文字抛出 ValueError，和 KeyError 不是同一种失败。常见的缺失不一定要用异常，意外的缺失才值得打断调用。

## 练习

架子上只有夜航在西柜。写查找函数，没有就返回空字符串。查询小径，若结果是空串就打印未找到。

::: answer 参考答案：空串路径
```python run expect="未找到" title="参考答案"
def find_shelf(title):
    shelf = {"夜航": "西柜"}
    if title not in shelf:
        return ""
    return shelf[title]

found = find_shelf("小径")
print("未找到" if found == "" else found)
```
:::

同一架子，没有就 raise KeyError。用 try 查询小径，打印异常类型名。

::: answer 参考答案：抛出路径
```python run expect="KeyError" title="参考答案"
def find_shelf(title):
    shelf = {"夜航": "西柜"}
    if title not in shelf:
        raise KeyError(title)
    return shelf[title]

try:
    print(find_shelf("小径"))
except KeyError as exc:
    print(type(exc).__name__)
```
:::
