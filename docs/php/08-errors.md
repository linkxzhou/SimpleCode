---
language: php
chapter: 8
title: "错误"
level: advanced
minutes: 18
goals:
  - "用 try 和 catch 接住 Exception"
  - "能用 if 判断的情况不用异常"
  - "失败时打印固定的词"
sources:
  - php-manual
  - php-right-way
updated: "2026-10-15"
---

throw new Exception 抛出异常，try 围住可能失败的代码，catch (Exception $e) 接住。接住之后打印「失败」，不要把消息全文写进期望，消息可能带文件路径。

除数是不是零可以先用 if 判断。解析这种「看完才知道」的失败才适合抛出。能用 if 写清楚的分支，不必绕进 try。

不要写空的 catch。接住却不打印、不返回，调用者会以为成功了。

```php run expect="失败" title="接住"
<?php
try {
  throw new Exception("x");
  echo "ok\n";
} catch (Exception $e) {
  echo "失败\n";
}
```

```php run expect="失败" title="除零"
<?php
function div_checked($a, $b) {
  if ($b === 0) throw new Exception("zero");
  return intdiv($a, $b);
}
try {
  echo div_checked(1, 0), "\n";
} catch (Exception $e) {
  echo "失败\n";
}
```

```php run expect="3" title="成功"
<?php
function div_checked($a, $b) {
  if ($b === 0) throw new Exception("zero");
  return intdiv($a, $b);
}
echo div_checked(20, 6), "\n";
```

### 读「接住」

先做这一例。把代码收成一行来记：`<?php try { throw new Exception("x"); echo "ok\n"; } catch (Exception $e) { echo "失败\n"; }`。先盖住终端，写下你预测的输出，里面要能找到「失败」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 读「除零」

做完上一例再做这一例。把代码收成一行来记：`<?php function div_checked($a, $b) { if ($b === 0) throw new Exception("zero"); return intdiv($a, $b); } try { echo div_checked(1, 0), "\n"; } catch (…`。先盖住终端，写下你预测的输出，里面要能找到「失败」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 读「成功」

做完上一例再做这一例。把代码收成一行来记：`<?php function div_checked($a, $b) { if ($b === 0) throw new Exception("zero"); return intdiv($a, $b); } echo div_checked(20, 6), "\n";`。先盖住终端，写下你预测的输出，里面要能找到「3」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。

### 只改一处：接住

这一例要避开的失误是：空的 catch，失败被吃掉。。对应的做法是：catch 里打印固定短词。。

把代码收成一行来核对：`<?php try { throw new Exception("x"); echo "ok\n"; } catch (Exception $e) { echo "失败\n"; }`。盖住终端，先写下预测，里面要能找到「失败」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「失败」才算失败。

### 只改一处：除零

这一例要避开的失误是：靠异常消息全文做分支。。对应的做法是：能 if 判断的先 if。。

把代码收成一行来核对：`<?php function div_checked($a, $b) { if ($b === 0) throw new Exception("zero"); return intdiv($a, $b); } try { echo div_checked(1, 0), "\n"; } catch (…`。盖住终端，先写下预测，里面要能找到「失败」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「失败」才算失败。

### 只改一处：成功

这一例要避开的失误是：除零这种能先判断的情况只靠 throw。。对应的做法是：成功路径 echo 数字。。

把代码收成一行来核对：`<?php function div_checked($a, $b) { if ($b === 0) throw new Exception("zero"); return intdiv($a, $b); } echo div_checked(20, 6), "\n";`。盖住终端，先写下预测，里面要能找到「3」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「3」才算失败。

## 读完再动手

本章要留下的是 「用 try 和 catch 接住 Exception」、「能用 if 判断的情况不用异常」、「失败时打印固定的词」。合上抽屉之前，用自己的话说出每一项目标对应哪一个示例的标题。对不上标题，就还没有把目标和代码连起来，先别展开练习答案。

练习的答案默认折着。先在编辑器里自己写，再展开对照。对照时只看输出是否包含期望的那几个字。两道都过了再进入下一章。下一次运行是新进程，这次的变量不会留下。

把这一章当成一次可以反复撤销的实验。点代码块上的 Run 会用示例覆盖编辑器，原来的草稿先备份。你改过的内容如果还想留着，先复制到别处，再点下一例。工具栏的 Run 不会从文档重写编辑器，所以它用来看你改过的版本。两种按钮各做各的事。下载进度写在按钮旁边，第一次打开这种语言时要等它结束，再判断示例是不是写错了。

记录你预测错的那一次。写下你以为会打印的文字，以及实际多出来或少掉的部分。进入下一章之前，要能用一句话说清差在哪。通过只说明期望的那几个字还在，不说明你已经看懂产生它的那一行。章节标题下的目标就是这份验收清单。差两个字也不要靠改期望凑过去。

## 常见错误

- 空的 catch，失败被吃掉。
- 靠异常消息全文做分支。
- 除零这种能先判断的情况只靠 throw。

## 最佳实践

- catch 里打印固定短词。
- 能 if 判断的先 if。
- 成功路径 echo 数字。

## 小结

异常按 Exception 接住。失败打印固定的词。能提前判断的情况仍用 if。

## 练习

抛出异常并打印失败。

::: answer 参考答案：失败
```php run expect="失败" title="参考答案"
<?php
try {
  throw new Exception("no");
} catch (Exception $e) {
  echo "失败\n";
}
```
:::

在除数非零时打印 17 和 5 的整数商。

::: answer 参考答案：商
```php run expect="3" title="参考答案"
<?php
echo intdiv(17, 5), "\n";
```
:::

## 延伸阅读

- [PHP Manual](https://www.php.net/manual/en/)（CC BY 3.0，仅链接）
- [PHP: The Right Way](https://phptherightway.com/)（仅链接）

## 参考与致谢

正文为原创。知识点范围参考了 PHP 手册与 PHP: The Right Way，没有逐字搬用原文。
