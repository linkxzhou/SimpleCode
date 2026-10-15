---
language: lua
chapter: 9
title: "不跨文件的模块"
level: advanced
minutes: 18
goals:
  - "用表装函数"
  - "不 require 另一份文件"
  - "把数据放在参数里而不是模块的全局状态"
sources:
  - pil
  - lua-manual
  - lxiy-lua
updated: "2026-10-15"
---

这里不能 require 磁盘上的另一个文件。模块就是同一个文件里的一张表，函数挂在表上。调用时把表名写出来，读代码时能看见函数从哪来。

不要把用户的分数存在模块表自己身上又让所有调用共享，除非你故意要共享。分数放在调用者传入的另一张表里，模块只提供操作。这样测试可以准备一张空表。

文件末尾不需要 return 模块给别人 require。脚本直接调用并 print。

```lua run expect="3" title="加分"
local M = {}
function M.add(box, name, n)
  box[name] = (box[name] or 0) + n
end
local box = {}
M.add(box, "Ada", 1)
M.add(box, "Ada", 2)
print(box.Ada)
```

```lua run expect="1" title="条数"
local M = {}
function M.count(items)
  local n = 0
  for i = 1, #items do
    if items[i] ~= "" then n = n + 1 end
  end
  return n
end
print(M.count({"买笔", ""}))
```

```lua run expect="4" title="读取"
local M = {}
function M.get(box, name)
  return box[name] or 0
end
local box = { Ada = 4 }
print(M.get(box, "Ada"))
```

```lua norun title="只读"
-- require("other") 会去找另一份文件，这里没有。
-- 把函数放进本文件的表。
```

### 读「加分」

先做这一例。把代码收成一行来记：`local M = {} function M.add(box, name, n) box[name] = (box[name] or 0) + n end local box = {} M.add(box, "Ada", 1) M.add(box, "Ada", 2) print(box.Ada)`。先盖住终端，写下你预测的输出，里面要能找到「3」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 读「条数」

做完上一例再做这一例。把代码收成一行来记：`local M = {} function M.count(items) local n = 0 for i = 1, #items do if items[i] ~= "" then n = n + 1 end end return n end print(M.count({"买笔", ""}))`。先盖住终端，写下你预测的输出，里面要能找到「1」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 读「读取」

做完上一例再做这一例。把代码收成一行来记：`local M = {} function M.get(box, name) return box[name] or 0 end local box = { Ada = 4 } print(M.get(box, "Ada"))`。先盖住终端，写下你预测的输出，里面要能找到「4」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

「只读」故意不能运行。先读它旁边的限制，再回到能点 Run 的例子上改一个值。不要把只读块当成坏掉的按钮。

### 只改一处：加分

这一例要避开的失误是：require 一个不存在的文件。。对应的做法是：模块是本文件里的 local 表。。

把代码收成一行来核对：`local M = {} function M.add(box, name, n) box[name] = (box[name] or 0) + n end local box = {} M.add(box, "Ada", 1) M.add(box, "Ada", 2) print(box.Ada)`。盖住终端，先写下预测，里面要能找到「3」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「3」才算失败。

### 只改一处：条数

这一例要避开的失误是：把每份数据都写进模块表，调用之间互相留下。。对应的做法是：数据由参数传入。。

把代码收成一行来核对：`local M = {} function M.count(items) local n = 0 for i = 1, #items do if items[i] ~= "" then n = n + 1 end end return n end print(M.count({"买笔", ""}))`。盖住终端，先写下预测，里面要能找到「1」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「1」才算失败。

### 只改一处：读取

这一例要避开的失误是：函数不用 local 的模块表，名字变成全局。。对应的做法是：只 print 函数算出的结果。。

把代码收成一行来核对：`local M = {} function M.get(box, name) return box[name] or 0 end local box = { Ada = 4 } print(M.get(box, "Ada"))`。盖住终端，先写下预测，里面要能找到「4」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「4」才算失败。

### 限制：只读

这一段故意不能运行。旁边的限制是：require 一个不存在的文件。。做法是：模块是本文件里的 local 表。。把它留在抽屉里对照，不要粘进主编辑器再点工具栏的 Run。能运行的例子在它前后，改那些例子时不要把这里的调用加进去。

## 读完再动手

本章要留下的是 「用表装函数」、「不 require 另一份文件」、「把数据放在参数里而不是模块的全局状态」。合上抽屉之前，用自己的话说出每一项目标对应哪一个示例的标题。对不上标题，就还没有把目标和代码连起来，先别展开练习答案。

练习的答案默认折着。先在编辑器里自己写，再展开对照。对照时只看输出是否包含期望的那几个字。两道都过了再进入下一章。下一次运行是新进程，这次的变量不会留下。

把这一章当成一次可以反复撤销的实验。点代码块上的 Run 会用示例覆盖编辑器，原来的草稿先备份。你改过的内容如果还想留着，先复制到别处，再点下一例。工具栏的 Run 不会从文档重写编辑器，所以它用来看你改过的版本。两种按钮各做各的事。下载进度写在按钮旁边，第一次打开这种语言时要等它结束，再判断示例是不是写错了。

记录你预测错的那一次。写下你以为会打印的文字，以及实际多出来或少掉的部分。进入下一章之前，要能用一句话说清差在哪。通过只说明期望的那几个字还在，不说明你已经看懂产生它的那一行。章节标题下的目标就是这份验收清单。差两个字也不要靠改期望凑过去。

## 常见错误

- require 一个不存在的文件。
- 把每份数据都写进模块表，调用之间互相留下。
- 函数不用 local 的模块表，名字变成全局。

## 最佳实践

- 模块是本文件里的 local 表。
- 数据由参数传入。
- 只 print 函数算出的结果。

## 小结

模块是同一文件里的表。不 require 别的文件。数据放在参数里，函数放在表上。

## 练习

表上的函数返回两倍，打印 21 的结果。

::: answer 参考答案：两倍
```lua run expect="42" title="参考答案"
local M = {}
function M.twice(n) return n * 2 end
print(M.twice(21))
```
:::

对空表取值，没有就打印 0。

::: answer 参考答案：空表
```lua run expect="0" title="参考答案"
local M = {}
function M.get(box, name) return box[name] or 0 end
print(M.get({}, "Ada"))
```
:::

## 延伸阅读

- [Programming in Lua](https://www.lua.org/pil/)（仅链接）
- [Lua 5.4 Reference Manual](https://www.lua.org/manual/5.4/)（MIT，仅链接）
- [Learn X in Y minutes — Lua](https://learnxinyminutes.com/lua/)（CC BY-SA 3.0，仅链接）

## 参考与致谢

正文为原创。知识点范围参考了 Programming in Lua、Lua 5.4 参考手册与 Learn X in Y minutes — Lua，没有逐字搬用原文。
