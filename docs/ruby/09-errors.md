---
language: ruby
chapter: 9
title: "错误"
level: advanced
minutes: 18
goals:
  - "用 begin 和 rescue 接住异常"
  - "按类型区分失败"
  - "不把正常分支写成异常"
sources:
  - lxiy-ruby
  - ruby-twenty
  - poignant
updated: "2026-10-15"
---

raise 抛出异常，begin 围住可能失败的代码，rescue 按类型接住。可以写多个 rescue，更具体的类型放在前面。rescue 不写类型时会接住 StandardError 及其子类，范围已经很大。不要写成什么都吞掉然后继续跑，那样名字写错也会被当成输入错误。

else 这类「没有异常才继续」可以用 begin 成功之后的普通代码代替。ensure 无论是否异常都会运行，适合做收尾。收尾里再抛异常会盖住原来的错误，所以 ensure 保持短。

能事先判断的情况用 if：键在不在、除数是不是零。解析用户输入这种「格式错了才知道」的情况适合 begin。Integer("no") 会抛 ArgumentError。接住之后打印固定的词，测试才稳。不要把异常消息的全文写进期望，消息可能带行号。

自定义异常继承 StandardError，名字以 Error 结尾。调用方 rescue 你的类型，而不是去读消息里的某个词。

```ruby run expect="失败" title="接住"
begin
  Integer("no")
  puts "ok"
rescue ArgumentError
  puts "失败"
end
```

```ruby run expect="arg" title="类型"
begin
  raise ArgumentError, "x"
rescue TypeError
  puts "type"
rescue ArgumentError
  puts "arg"
end
```

```ruby run expect="2" title="ensure"
n = 0
begin
  n = 1
ensure
  n += 1
end
puts n
```

### 读「接住」

先做这一例。把代码收成一行来记：`begin Integer("no") puts "ok" rescue ArgumentError puts "失败" end`。先盖住终端，写下你预测的输出，里面要能找到「失败」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 读「类型」

做完上一例再做这一例。把代码收成一行来记：`begin raise ArgumentError, "x" rescue TypeError puts "type" rescue ArgumentError puts "arg" end`。先盖住终端，写下你预测的输出，里面要能找到「arg」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 读「ensure」

做完上一例再做这一例。把代码收成一行来记：`n = 0 begin n = 1 ensure n += 1 end puts n`。先盖住终端，写下你预测的输出，里面要能找到「2」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 只改一处：接住

这一例要避开的失误是：rescue 不写类型，把真正的缺陷也接住。。对应的做法是：rescue 写出具体类型，更具体的放前面。。

把代码收成一行来核对：`begin Integer("no") puts "ok" rescue ArgumentError puts "失败" end`。盖住终端，先写下预测，里面要能找到「失败」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「失败」才算失败。

### 只改一处：类型

这一例要避开的失误是：靠异常消息的全文做分支。。对应的做法是：失败时打印固定的短词，不打印整段消息。。

把代码收成一行来核对：`begin raise ArgumentError, "x" rescue TypeError puts "type" rescue ArgumentError puts "arg" end`。盖住终端，先写下预测，里面要能找到「arg」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「arg」才算失败。

### 只改一处：ensure

这一例要避开的失误是：能用 if 判断的情况故意 raise 再 rescue。。对应的做法是：ensure 里只做收尾，不再抛新的异常。。

把代码收成一行来核对：`n = 0 begin n = 1 ensure n += 1 end puts n`。盖住终端，先写下预测，里面要能找到「2」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「2」才算失败。

## 读完再动手

本章要留下的是 「用 begin 和 rescue 接住异常」、「按类型区分失败」、「不把正常分支写成异常」。合上抽屉之前，用自己的话说出每一项目标对应哪一个示例的标题。对不上标题，就还没有把目标和代码连起来，先别展开练习答案。

练习的答案默认折着。先在编辑器里自己写，再展开对照。对照时只看输出是否包含期望的那几个字。两道都过了再进入下一章。下一次运行是新进程，这次的变量不会留下。

把这一章当成一次可以反复撤销的实验。点代码块上的 Run 会用示例覆盖编辑器，原来的草稿先备份。你改过的内容如果还想留着，先复制到别处，再点下一例。工具栏的 Run 不会从文档重写编辑器，所以它用来看你改过的版本。两种按钮各做各的事。下载进度写在按钮旁边，第一次打开这种语言时要等它结束，再判断示例是不是写错了。

记录你预测错的那一次。写下你以为会打印的文字，以及实际多出来或少掉的部分。进入下一章之前，要能用一句话说清差在哪。通过只说明期望的那几个字还在，不说明你已经看懂产生它的那一行。章节标题下的目标就是这份验收清单。差两个字也不要靠改期望凑过去。

## 常见错误

- rescue 不写类型，把真正的缺陷也接住。
- 靠异常消息的全文做分支。
- 能用 if 判断的情况故意 raise 再 rescue。

## 最佳实践

- rescue 写出具体类型，更具体的放前面。
- 失败时打印固定的短词，不打印整段消息。
- ensure 里只做收尾，不再抛新的异常。

## 小结

异常按类型接住。解析文本适合 begin，能提前判断的失败仍用 if。ensure 一定会运行，里面不要再制造新的失败。

## 练习

把 no 转成整数，失败时打印「失败」。

::: answer 参考答案：整数
```ruby run expect="失败" title="参考答案"
begin
  puts Integer("no")
rescue ArgumentError
  puts "失败"
end
```
:::

把 7 转成整数并打印。

::: answer 参考答案：成功
```ruby run expect="7" title="参考答案"
puts Integer("7")
```
:::

## 延伸阅读

- [Ruby in Twenty Minutes](https://www.ruby-lang.org/en/documentation/quickstart/)（仅链接）
- [Learn X in Y minutes — Ruby](https://learnxinyminutes.com/ruby/)（CC BY-SA 3.0，仅链接）

## 参考与致谢

正文为原创。知识点范围参考了 Ruby 官方二十分钟入门与 Learn X in Y minutes — Ruby，没有逐字搬用原文。
