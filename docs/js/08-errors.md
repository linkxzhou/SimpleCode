---
language: js
chapter: 8
title: "错误处理"
level: intermediate
minutes: 18
goals:
  - "用 try / catch 接住 throw"
  - "区分错误类型"
  - "解析可能损坏的 JSON"
sources:
  - mdn-js
  - lxiy-js
updated: "2026-10-15"
---

`throw` 可以抛任何值，习惯抛 `Error` 或其子类，这样有消息和堆栈。`catch` 接住后程序继续。不要空 catch。

JSON 损坏是可预期的失败，适合就地告诉调用者。

```js run expect="1" title="解析 JSON"
function parse(text) {
  try {
    return JSON.parse(text).n;
  } catch (err) {
    return "坏 JSON";
  }
}
console.log(parse('{"n":1}'));
console.log(parse("nope"));
```

```js run expect="空" title="自定义错误"
class EmptyInput extends Error {}
function need(text) {
  if (text.trim() === "") throw new EmptyInput("空白");
  return text;
}
try {
  need("  ");
} catch (err) {
  console.log(err instanceof EmptyInput ? "空" : "其他");
}
```

```js run expect="5" title="先检查再算"
function divide(a, b) {
  if (b === 0) throw new Error("zero");
  return a / b;
}
console.log(divide(10, 2));
```

throw 可以抛任何值，习惯抛 Error。自定义错误继承 Error，这样 instanceof 才好用。抛字符串时，catch 里的 instanceof Error 为假，栈也不完整。

try 只包可能失败的那几行。catch 里要么处理，要么再抛出去。空的 catch 会把失败吞掉，后面的代码以为成功了。

JSON.parse 对坏文本抛 SyntaxError。这是可预期的输入错误，适合就地变成一句提示。程序自己的 bug，例如读了未定义的变量，不应该被同一个 catch (e) 悄悄吃掉。可以先判断 e instanceof SyntaxError。

finally 总会执行，适合清理。不要在 finally 里 return，它会盖住 try 里的返回值。本环境没有必须关闭的句柄，示例很少用 finally，知道它的顺序即可：try，然后 catch，然后 finally。

错误消息写给人看，写成完整的短句。错误类型写给程序看。两者都要有。只写消息，调用方只好 indexOf 去找关键字，消息一改调用方就坏。

try 里面赋值的变量，在 catch 里可能还没有。把 let 放在 try 外面，catch 才能读到「失败前已经得到的一半结果」。本章例子不需要一半结果，直接在 catch 里打印固定文本。

不要用异常代替返回空数组。找不到数据通常是正常情况，返回空集合更清楚。解析失败、除以零、违反不变量，才值得 throw。

throw 抛出的应当是 Error 或其子类。抛字符串也能被 catch 接住，但没有栈，也没有 instanceof 可分。catch 的参数不要空着不管。空的 catch 会让失败消失，程序带着错的状态继续。至少打印消息，或者再抛出去。

try 只包住可能失败的那几行。把整段函数都包进去，名字写错也会被当成输入错误。用 instanceof 区分 SyntaxError、TypeError 和你自己的错误。消息写给人看，类型写给程序看。不要靠消息里的某个词来分支，消息一改分支就坏。

JSON.parse 遇到不合法的文本会抛 SyntaxError。解析用户输入时，catch 这一类型并打印固定的短句。再抛出时可以包一层新的 Error，把原因留在 cause 或消息里。本章的例子若再抛，就打印它是不是 Error，确认类型还在。

finally 里做清理，不要在 finally 里解析数据。清理代码再抛异常会盖住原来的错误。这个环境没有需要关闭的文件句柄时，不必为了形式写 finally。

### 读「再抛」

先做这一例。代码收成一行是 `function boom() { throw new Error('x'); } try { boom(); } catch (err) { console.log(err instanceof Error); }`。先盖住终端，用手算结果，纸上的文本里要能找到「true」。这是子串：前面可以有别的输出，后面通常有换行，不要要求整屏只有这几个字。

然后点这个代码块上的 Run，不要点工具栏。代码块会先备份草稿，再把示例写进编辑器并执行。终端里用眼睛找「true」。退出码不是 0 时，先读错误的类型和最后一行，此时不要改期望。退出码是 0 但找不到这段文字，说明打印了别的值，回到产生该值的表达式，只改一处。

改过之后再点代码块上的 Run，会把你的修改盖掉。要验证修改，点工具栏上的 Run。预测和新输出一致后，点撤销，把草稿还给自己。一次只改这一例，不要连着改两个代码块。

### 读「区分类型」

做完上一个再做这一例。代码收成一行是 `try { JSON.parse('no'); } catch (err) { console.log(err instanceof SyntaxError ? 'syntax' : 'other'); }`。先盖住终端，用手算结果，纸上的文本里要能找到「syntax」。这是子串：前面可以有别的输出，后面通常有换行，不要要求整屏只有这几个字。

然后点这个代码块上的 Run，不要点工具栏。代码块会先备份草稿，再把示例写进编辑器并执行。终端里用眼睛找「syntax」。退出码不是 0 时，先读错误的类型和最后一行，此时不要改期望。退出码是 0 但找不到这段文字，说明打印了别的值，回到产生该值的表达式，只改一处。

改过之后再点代码块上的 Run，会把你的修改盖掉。要验证修改，点工具栏上的 Run。预测和新输出一致后，点撤销，把草稿还给自己。一次只改这一例，不要连着改两个代码块。

实践 1 写成一句就是：抛 Error 或其子类，不抛裸字符串。 用「再抛」当检查对象。删掉一个保护条件，或把比较符号反过来，看失败是报错还是静默地打出另一个数。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：打印消息」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

实践 2 写成一句就是：catch 要处理或再抛，不要写空块。 用「区分类型」当检查对象。把本该新建的对象改成复用已有的名字，看两个名字会不会一起变。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：打印消息」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

实践 3 写成一句就是：解析 JSON 时只把 SyntaxError 当成输入错误。 用「再抛」当检查对象。少写一个边界：少一次循环、少一个参数或少接住一个返回值，看输出正好差在哪。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：打印消息」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

练习先不看折叠答案。题目是：throw 一个 Error，catch 后打印消息 oops。 做完再对照「参考答案：打印消息」。能说出自己的写法和答案差在哪一行，这道题才算完成。本章的另一道练习查的不是同一件事，两道都做。

收束时用一句话复述：用类型区分错误，try 只包住可能失败的代码。空的 catch 和抛字符串都会让失败难以追查。 若只能留下三句，就留下上面三条实践，并为每一条记住一个你刚刚故意做错的反例。

```js run expect="true" title="再抛"
function boom() { throw new Error('x'); }
try {
  boom();
} catch (err) {
  console.log(err instanceof Error);
}
```

```js run expect="syntax" title="区分类型"
try {
  JSON.parse('no');
} catch (err) {
  console.log(err instanceof SyntaxError ? 'syntax' : 'other');
}
```

## 练习

catch 住一次 throw，打印「接住了」。

::: answer 参考答案
```js run expect="接住了" title="参考答案"
try {
  throw new Error("x");
} catch (err) {
  console.log("接住了");
}
```
:::

throw 一个 Error，catch 后打印消息 oops。

::: answer 参考答案：打印消息
```js run expect="oops" title="参考答案"
try {
  throw new Error('oops');
} catch (err) {
  console.log(err.message);
}
```
:::

## 最佳实践

- 抛 Error 或其子类，不抛裸字符串。
- catch 要处理或再抛，不要写空块。
- 解析 JSON 时只把 SyntaxError 当成输入错误。

## 小结

用类型区分错误，try 只包住可能失败的代码。空的 catch 和抛字符串都会让失败难以追查。

## 常见错误

- catch 之后不记录就继续。失败原因会消失。
- 用字符串 throw。instanceof Error 会失败。

## 延伸阅读

- [javascript.info](https://javascript.info/)（CC BY-NC-SA，仅链接）
- [Eloquent JavaScript](https://eloquentjavascript.net/)（CC BY-NC，仅链接）

## 参考与致谢

正文为原创。知识点范围参考了 MDN JavaScript Guide（CC BY-SA 2.5）和 Learn X in Y minutes — JavaScript（CC BY-SA 3.0）。TypeScript 章节的概念范围参考 TypeScript Handbook（CC BY 4.0）。没有逐字搬用这些文档。
