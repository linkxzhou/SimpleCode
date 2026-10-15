---
language: lua
chapter: 8
title: "pcall"
level: advanced
minutes: 18
goals:
  - "用 pcall 接住 error"
  - "按第一个返回值判断成败"
  - "不把错误消息全文写进期望"
sources:
  - pil
  - lua-manual
  - lxiy-lua
updated: "2026-10-15"
---

error 抛出错误，若不接住，整份脚本停在那里。pcall(函数) 的第一个返回值是 true 或 false。失败时第二个返回值是错误对象。打印时只打「失败」或成功的数字，不打错误消息，消息里可能有行号。

能用 if 判断的情况不必 error。除数是不是零可以先看。pcall 适合「调用了一段可能失败的代码，调用前看不出来」。

pcall 接住之后，脚本还可以继续 print。不要接住了却什么都不做，看起来像成功。

```lua run expect="失败" title="接住"
local ok = pcall(function()
  error("boom")
end)
if ok then print("ok") else print("失败") end
```

```lua run expect="42" title="成功"
local ok, value = pcall(function()
  return 19 + 23
end)
if ok then print(value) else print("失败") end
```

```lua run expect="3" title="除零先判断"
local function div(a, b)
  if b == 0 then return nil end
  return a // b
end
local q = div(20, 6)
if q == nil then print("失败") else print(q) end
```

### 读「接住」

先做这一例。把代码收成一行来记：`local ok = pcall(function() error("boom") end) if ok then print("ok") else print("失败") end`。先盖住终端，写下你预测的输出，里面要能找到「失败」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 读「成功」

做完上一例再做这一例。把代码收成一行来记：`local ok, value = pcall(function() return 19 + 23 end) if ok then print(value) else print("失败") end`。先盖住终端，写下你预测的输出，里面要能找到「42」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 读「除零先判断」

做完上一例再做这一例。把代码收成一行来记：`local function div(a, b) if b == 0 then return nil end return a // b end local q = div(20, 6) if q == nil then print("失败") else print(q) end`。先盖住终端，写下你预测的输出，里面要能找到「3」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 只改一处：接住

这一例要避开的失误是：不看 pcall 的第一个返回值，把错误对象当结果打印。。对应的做法是：失败打印固定短词。。

把代码收成一行来核对：`local ok = pcall(function() error("boom") end) if ok then print("ok") else print("失败") end`。盖住终端，先写下预测，里面要能找到「失败」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「失败」才算失败。

### 只改一处：成功

这一例要避开的失误是：把错误消息全文写进期望。。对应的做法是：成功时打印第二个返回值里的数字。。

把代码收成一行来核对：`local ok, value = pcall(function() return 19 + 23 end) if ok then print(value) else print("失败") end`。盖住终端，先写下预测，里面要能找到「42」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「42」才算失败。

### 只改一处：除零先判断

这一例要避开的失误是：能 if 判断的情况故意 error。。对应的做法是：除零用 if，而不是靠错误消息。。

把代码收成一行来核对：`local function div(a, b) if b == 0 then return nil end return a // b end local q = div(20, 6) if q == nil then print("失败") else print(q) end`。盖住终端，先写下预测，里面要能找到「3」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「3」才算失败。

## 读完再动手

本章要留下的是 「用 pcall 接住 error」、「按第一个返回值判断成败」、「不把错误消息全文写进期望」。合上抽屉之前，用自己的话说出每一项目标对应哪一个示例的标题。对不上标题，就还没有把目标和代码连起来，先别展开练习答案。

练习的答案默认折着。先在编辑器里自己写，再展开对照。对照时只看输出是否包含期望的那几个字。两道都过了再进入下一章。下一次运行是新进程，这次的变量不会留下。

把这一章当成一次可以反复撤销的实验。点代码块上的 Run 会用示例覆盖编辑器，原来的草稿先备份。你改过的内容如果还想留着，先复制到别处，再点下一例。工具栏的 Run 不会从文档重写编辑器，所以它用来看你改过的版本。两种按钮各做各的事。下载进度写在按钮旁边，第一次打开这种语言时要等它结束，再判断示例是不是写错了。

记录你预测错的那一次。写下你以为会打印的文字，以及实际多出来或少掉的部分。进入下一章之前，要能用一句话说清差在哪。通过只说明期望的那几个字还在，不说明你已经看懂产生它的那一行。章节标题下的目标就是这份验收清单。差两个字也不要靠改期望凑过去。

## 常见错误

- 不看 pcall 的第一个返回值，把错误对象当结果打印。
- 把错误消息全文写进期望。
- 能 if 判断的情况故意 error。

## 最佳实践

- 失败打印固定短词。
- 成功时打印第二个返回值里的数字。
- 除零用 if，而不是靠错误消息。

## 小结

pcall 的第一个返回值表示是否成功。失败时打印固定的词，不依赖错误消息的全文。

## 练习

pcall 一段会 error 的函数，失败时打印失败。

::: answer 参考答案：失败
```lua run expect="失败" title="参考答案"
local ok = pcall(function() error("x") end)
if not ok then print("失败") end
```
:::

pcall 返回 7 并打印。

::: answer 参考答案：成功
```lua run expect="7" title="参考答案"
local ok, value = pcall(function() return 7 end)
if ok then print(value) end
```
:::

## 延伸阅读

- [Programming in Lua](https://www.lua.org/pil/)（仅链接）
- [Lua 5.4 Reference Manual](https://www.lua.org/manual/5.4/)（MIT，仅链接）
- [Learn X in Y minutes — Lua](https://learnxinyminutes.com/lua/)（CC BY-SA 3.0，仅链接）

## 参考与致谢

正文为原创。知识点范围参考了 Programming in Lua、Lua 5.4 参考手册与 Learn X in Y minutes — Lua，没有逐字搬用原文。
