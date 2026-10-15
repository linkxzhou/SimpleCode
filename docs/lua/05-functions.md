---
language: lua
chapter: 5
title: "函数与闭包"
level: intermediate
minutes: 18
goals:
  - "定义函数并返回值"
  - "让闭包看见外层的 local"
  - "知道 print 不会自动打印返回值"
sources:
  - pil
  - lua-manual
  - lxiy-lua
updated: "2026-10-15"
---

函数是值。写成 local function add(a, b) 或 local add = function(a, b)。return 交回结果，不会自动打印。调用后 print。

闭包可以看见外层的 local，并且能改它。多次调用同一个闭包，会看见上一次留下的那个变量。这是计数器的常见写法。不要把这种状态放进全局。

参数按位置传入。少传了就是 nil。需要默认值时，在函数里写 n = n or 0。注意 or 会把 false 也换成默认值，所以只对「nil 表示没传」的数字使用。

```lua run expect="42" title="相加"
local function add(a, b)
  return a + b
end
print(add(41, 1))
```

```lua run expect="2" title="闭包"
local function counter()
  local n = 0
  return function()
    n = n + 1
    return n
  end
end
local nextn = counter()
nextn()
print(nextn())
```

```lua run expect="42" title="默认"
local function add(a, b)
  b = b or 1
  return a + b
end
print(add(41))
```

### 读「相加」

先做这一例。把代码收成一行来记：`local function add(a, b) return a + b end print(add(41, 1))`。先盖住终端，写下你预测的输出，里面要能找到「42」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 读「闭包」

做完上一例再做这一例。把代码收成一行来记：`local function counter() local n = 0 return function() n = n + 1 return n end end local nextn = counter() nextn() print(nextn())`。先盖住终端，写下你预测的输出，里面要能找到「2」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 读「默认」

做完上一例再做这一例。把代码收成一行来记：`local function add(a, b) b = b or 1 return a + b end print(add(41))`。先盖住终端，写下你预测的输出，里面要能找到「42」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 只改一处：相加

这一例要避开的失误是：以为函数最后一行会自己打印。。对应的做法是：函数写成 local。。

把代码收成一行来核对：`local function add(a, b) return a + b end print(add(41, 1))`。盖住终端，先写下预测，里面要能找到「42」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「42」才算失败。

### 只改一处：闭包

这一例要避开的失误是：计数器不用 local，写成全局，下一次逻辑互相看见。。对应的做法是：要核对的结果 print 出来。。

把代码收成一行来核对：`local function counter() local n = 0 return function() n = n + 1 return n end end local nextn = counter() nextn() print(nextn())`。盖住终端，先写下预测，里面要能找到「2」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「2」才算失败。

### 只改一处：默认

这一例要避开的失误是：用 or 给可能是 false 的参数做默认。。对应的做法是：闭包里要记住的状态用外层 local。。

把代码收成一行来核对：`local function add(a, b) b = b or 1 return a + b end print(add(41))`。盖住终端，先写下预测，里面要能找到「42」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「42」才算失败。

## 读完再动手

本章要留下的是 「定义函数并返回值」、「让闭包看见外层的 local」、「知道 print 不会自动打印返回值」。合上抽屉之前，用自己的话说出每一项目标对应哪一个示例的标题。对不上标题，就还没有把目标和代码连起来，先别展开练习答案。

练习的答案默认折着。先在编辑器里自己写，再展开对照。对照时只看输出是否包含期望的那几个字。两道都过了再进入下一章。下一次运行是新进程，这次的变量不会留下。

把这一章当成一次可以反复撤销的实验。点代码块上的 Run 会用示例覆盖编辑器，原来的草稿先备份。你改过的内容如果还想留着，先复制到别处，再点下一例。工具栏的 Run 不会从文档重写编辑器，所以它用来看你改过的版本。两种按钮各做各的事。下载进度写在按钮旁边，第一次打开这种语言时要等它结束，再判断示例是不是写错了。

记录你预测错的那一次。写下你以为会打印的文字，以及实际多出来或少掉的部分。进入下一章之前，要能用一句话说清差在哪。通过只说明期望的那几个字还在，不说明你已经看懂产生它的那一行。章节标题下的目标就是这份验收清单。差两个字也不要靠改期望凑过去。

## 常见错误

- 以为函数最后一行会自己打印。
- 计数器不用 local，写成全局，下一次逻辑互相看见。
- 用 or 给可能是 false 的参数做默认。

## 最佳实践

- 函数写成 local。
- 要核对的结果 print 出来。
- 闭包里要记住的状态用外层 local。

## 小结

函数用 return 交回结果。闭包能记住外层的 local。print 才把结果送到终端。

## 练习

写函数返回平方，打印 6 的平方。

::: answer 参考答案：平方
```lua run expect="36" title="参考答案"
local function sq(n) return n * n end
print(sq(6))
```
:::

写函数返回两倍，打印 21 的结果。

::: answer 参考答案：两倍
```lua run expect="42" title="参考答案"
local function twice(n) return n * 2 end
print(twice(21))
```
:::

## 延伸阅读

- [Programming in Lua](https://www.lua.org/pil/)（仅链接）
- [Lua 5.4 Reference Manual](https://www.lua.org/manual/5.4/)（MIT，仅链接）
- [Learn X in Y minutes — Lua](https://learnxinyminutes.com/lua/)（CC BY-SA 3.0，仅链接）

## 参考与致谢

正文为原创。知识点范围参考了 Programming in Lua、Lua 5.4 参考手册与 Learn X in Y minutes — Lua，没有逐字搬用原文。
