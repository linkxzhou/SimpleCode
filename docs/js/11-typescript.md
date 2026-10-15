---
language: js
chapter: 11
title: "TypeScript 入门"
level: advanced
minutes: 18
goals:
  - "给参数和返回值加类型"
  - "用 interface 描述对象"
  - "知道这里只去类型、不做检查"
sources:
  - mdn-js
  - ts-handbook
  - lxiy-js
updated: "2026-10-15"
---

`ts` 代码块会用项目里的 Sucrase 去掉类型，再交给 QuickJS。没有类型检查：错误的标注也会跑。编辑器里放的是转译后的 JavaScript，第一行注释说明原文在文档里。

联合类型在运行时就是普通的值，收窄要自己判断。

```ts run expect="买笔" title="待办"
interface Todo {
  title: string;
  done: boolean;
}
const item: Todo = { title: "买笔", done: false };
console.log(item.title);
```

```ts run expect="42" title="标注函数"
function add(a: number, b: number): number {
  return a + b;
}
console.log(add(20, 22));
```

```ts run expect="n:7" title="联合类型"
type Id = string | number;
function show(x: Id): string {
  if (typeof x === "number") return "n:" + x;
  return "s:" + x;
}
console.log(show(7));
```

类型标注在转译后会被删掉。Sucrase 不做检查：你把 number 标在字符串上，程序仍会跑。类型是写给读者和将来的编译器看的，在这个抽屉里它改变不了运行结果。

interface 描述对象有哪些字段。多一个字段在转译后不会被删掉，因为那是值；少一个字段也不会报错。运行时该缺还是缺，读字段得到 undefined。

联合类型在运行时就是普通的值。收窄要自己写 typeof 或比较。写了收窄，转译后 if 还在，所以分支仍然有效。泛型同样会被抹掉，identity 就是把参数原样返回。

不要在 ts 块里 import。转译不会帮你加载模块。一个文件里写完类型和值。编辑器里第一行注释提醒你：看见的 JavaScript 不是文档原文。

转译失败和运行失败不是同一件事。类型写错但语法仍合法，Sucrase 能去掉类型，QuickJS 会跑。语法错了，例如少一个括号，转译就会失败，终端里能看到位置。文档示例必须是合法语法。

interface 不存在于运行时。你不能 instanceof Todo。要判断一个值像不像待办，自己看字段。类型系统在本地编辑器里能做的事，这里都不会做。

泛型函数转译后就是普通函数。同一个 identity 既可以传数字也可以传字符串，因为检查被删了。示例只演示一种调用，避免让人以为这里会拒绝另一种。

TypeScript 在这个抽屉里只被去掉类型，然后交给 QuickJS。标注帮助你阅读，不会在运行前拦住错误的类型。参数标成 number，你仍可以在转译后的 JavaScript 里传入字符串，引擎会按 JavaScript 的规则处理。因此示例的正确性靠打印结果证明，不靠编译器。

interface 和 type 在转译后消失。对象字面量的字段还在，所以读取 name 仍然得到原来的字符串。类型别名不会在运行时出现一个可以打印的构造函数。不要写会依赖反射类型的代码。

收窄用的 if 会留下来。typeof x === "number" 这种判断既是类型收窄，也是运行时分支。转译不会把 if 删掉。联合类型在运行时就是其中一种实际值。打印时打印实际值，不要打印类型的名字，除非你自己把名字放进字符串。

转译失败和运行失败不同。少一个括号，转译就会失败，终端里能看到位置。类型不匹配但语法合法，转译成功，运行结果可能不是你以为的那种。读文档块时，编辑器里应出现一行转译注释，文件内容是去掉类型之后的 JavaScript。

### 读「字段还在」

先做这一例。代码收成一行是 `interface Item { name: string } const item: Item = { name: 'pen' }; console.log(item.name);`。先盖住终端，用手算结果，纸上的文本里要能找到「pen」。这是子串：前面可以有别的输出，后面通常有换行，不要要求整屏只有这几个字。

然后点这个代码块上的 Run，不要点工具栏。代码块会先备份草稿，再把示例写进编辑器并执行。终端里用眼睛找「pen」。退出码不是 0 时，先读错误的类型和最后一行，此时不要改期望。退出码是 0 但找不到这段文字，说明打印了别的值，回到产生该值的表达式，只改一处。

改过之后再点代码块上的 Run，会把你的修改盖掉。要验证修改，点工具栏上的 Run。预测和新输出一致后，点撤销，把草稿还给自己。一次只改这一例，不要连着改两个代码块。

### 读「收窄保留」

做完上一个再做这一例。代码收成一行是 `function show(x: string | number): string { return typeof x === 'number' ? 'n' : 's'; } console.log(show('a'));`。先盖住终端，用手算结果，纸上的文本里要能找到「s」。这是子串：前面可以有别的输出，后面通常有换行，不要要求整屏只有这几个字。

然后点这个代码块上的 Run，不要点工具栏。代码块会先备份草稿，再把示例写进编辑器并执行。终端里用眼睛找「s」。退出码不是 0 时，先读错误的类型和最后一行，此时不要改期望。退出码是 0 但找不到这段文字，说明打印了别的值，回到产生该值的表达式，只改一处。

改过之后再点代码块上的 Run，会把你的修改盖掉。要验证修改，点工具栏上的 Run。预测和新输出一致后，点撤销，把草稿还给自己。一次只改这一例，不要连着改两个代码块。

实践 1 写成一句就是：把类型当文档。需要真的拒绝错误类型时，用本地的 tsc，不要指望这里。 用「字段还在」当检查对象。删掉一个保护条件，或把比较符号反过来，看失败是报错还是静默地打出另一个数。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：标注加法」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

实践 2 写成一句就是：收窄逻辑写成真正的 if，转译后它仍然保护运行结果。 用「收窄保留」当检查对象。把本该新建的对象改成复用已有的名字，看两个名字会不会一起变。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：标注加法」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

实践 3 写成一句就是：ts 块保持单文件，不写 import。 用「字段还在」当检查对象。少写一个边界：少一次循环、少一个参数或少接住一个返回值，看输出正好差在哪。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：标注加法」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

练习先不看折叠答案。题目是：写一个带返回类型 number 的函数，返回 20+22 并打印。 做完再对照「参考答案：标注加法」。能说出自己的写法和答案差在哪一行，这道题才算完成。本章的另一道练习查的不是同一件事，两道都做。

收束时用一句话复述：TypeScript 在这里只被去掉类型。标注帮助阅读，收窄用的 if 会留下来，错误标注不会被拦住。 若只能留下三句，就留下上面三条实践，并为每一条记住一个你刚刚故意做错的反例。

```ts run expect="pen" title="字段还在"
interface Item { name: string }
const item: Item = { name: 'pen' };
console.log(item.name);
```

```ts run expect="s" title="收窄保留"
function show(x: string | number): string {
  return typeof x === 'number' ? 'n' : 's';
}
console.log(show('a'));
```

## 练习

写一个泛型函数 identity，传入 42 再打印。类型参数会被去掉，运行结果与普通函数相同。

::: answer 参考答案
```ts run expect="42" title="参考答案"
function identity<T>(value: T): T {
  return value;
}
console.log(identity(42));
```
:::

写一个带返回类型 number 的函数，返回 20+22 并打印。

::: answer 参考答案：标注加法
```ts run expect="42" title="参考答案"
function add(a: number, b: number): number {
  return a + b;
}
console.log(add(20, 22));
```
:::

## 最佳实践

- 把类型当文档。需要真的拒绝错误类型时，用本地的 tsc，不要指望这里。
- 收窄逻辑写成真正的 if，转译后它仍然保护运行结果。
- ts 块保持单文件，不写 import。

## 小结

TypeScript 在这里只被去掉类型。标注帮助阅读，收窄用的 if 会留下来，错误标注不会被拦住。

## 常见错误

- 指望转译器拒绝错误类型。Sucrase 只删除类型。
- 在 ts 块里写 import。转译后仍然是单文件，没有模块加载。

## 延伸阅读

- [javascript.info](https://javascript.info/)（CC BY-NC-SA，仅链接）
- [Eloquent JavaScript](https://eloquentjavascript.net/)（CC BY-NC，仅链接）

## 参考与致谢

正文为原创。知识点范围参考了 MDN JavaScript Guide（CC BY-SA 2.5）和 Learn X in Y minutes — JavaScript（CC BY-SA 3.0）。TypeScript 章节的概念范围参考 TypeScript Handbook（CC BY 4.0）。没有逐字搬用这些文档。
