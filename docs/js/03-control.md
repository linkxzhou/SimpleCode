---
language: js
chapter: 3
title: "控制流"
level: beginner
minutes: 18
goals:
  - "写 if 和 switch"
  - "用 for 与 for...of"
  - "打印九九乘法表的一行"
sources:
  - mdn-js
  - lxiy-js
updated: "2026-10-15"
---

代码块用花括号。`for...of` 遍历值，`for...in` 遍历键，数组请用 of。`switch` 要用 `break`，否则会继续掉进下一支。

```js run expect="1 2 Fizz 4 Buzz Fizz 7" title="FizzBuzz"
const lines = [];
for (let n = 1; n <= 7; n++) {
  if (n % 15 === 0) lines.push("FizzBuzz");
  else if (n % 3 === 0) lines.push("Fizz");
  else if (n % 5 === 0) lines.push("Buzz");
  else lines.push(String(n));
}
console.log(lines.join(" "));
```

```js run expect="2x1=2 2x2=4 2x3=6" title="乘法表一行"
let row = "";
for (let i = 1; i <= 3; i++) row += "2x" + i + "=" + 2 * i + " ";
console.log(row.trim());
```

```js run expect="二" title="switch"
const n = 2;
switch (n) {
  case 1:
    console.log("一");
    break;
  case 2:
    console.log("二");
    break;
  default:
    console.log("其他");
}
```

if 的条件只要真值就会进入。0、空字符串、null、undefined、NaN 都是假。其余多数值是真，包括空对象和空数组。不要用 if (arr) 判断数组有没有元素，空数组也是真，要看 arr.length。

for 的三件套是初始、条件、更新。for...of 遍历值，适合数组和字符串。for...in 遍历键，数组上会得到下标字符串，还可能遇到别人加在原型上的键。遍历数组用 of。

switch 用 === 匹配，没有匹配又没有 default 就什么都不做。case 后面不写 break 会继续执行下一支，这叫贯穿。想贯穿时写注释，否则一律 break。

循环里的 const 在每一轮都是新绑定，所以 for (const n of items) 是安全的。不要在循环外面使用那一个 n，它的作用域在循环里。

真值表不需要背完。记住空字符串、0、null、undefined、NaN 为假，其他你遇到的普通对象为真，就够写分支。空数组是真，这是最常忘的一条。

for...of 中途 break 是正常的，用来找到第一个符合条件的元素。不要为了这个去展开全部结果。switch 的 default 放最后，即使你以为所有情况都列过了，default 也能在数据脏了时给出可见的输出。

分支看真值。空字符串、0、null、undefined、NaN 为假，普通对象为真。空数组是真，这是最常忘的一条。判断「没有元素」要看 length，不要把数组放进 if。判断「有没有这个对象」才直接用对象本身。

for 适合按下标走，for...of 适合按元素走。循环变量用 let 或 const，不要用 var，否则循环外仍能看见它，而且闭包会共享同一个绑定。累加时先把总和设为 0，再在循环里加。忘记初始值，第一次加就会碰到 undefined。

switch 用 === 比较，匹配之后不会自己停下。每一支的末尾写 break，除非你故意让它落到下一支，并且在注释里写明。default 放最后，处理「都不是」的情况。条件很多又互相覆盖时，用 if 的顺序表达优先级，不要用 switch 硬套范围。

while 同样要求每一轮都有变量靠近结束。死循环会占住 QuickJS，页面上要点停止。写条件时先用两个具体的数在纸上走完，再把范围放大。

### 读「空数组是真」

先做这一例。代码收成一行是 `const items = []; console.log(Boolean(items)); console.log(items.length === 0);`。先盖住终端，用手算结果，纸上的文本里要能找到「true」。这是子串：前面可以有别的输出，后面通常有换行，不要要求整屏只有这几个字。

然后点这个代码块上的 Run，不要点工具栏。代码块会先备份草稿，再把示例写进编辑器并执行。终端里用眼睛找「true」。退出码不是 0 时，先读错误的类型和最后一行，此时不要改期望。退出码是 0 但找不到这段文字，说明打印了别的值，回到产生该值的表达式，只改一处。

改过之后再点代码块上的 Run，会把你的修改盖掉。要验证修改，点工具栏上的 Run。预测和新输出一致后，点撤销，把草稿还给自己。一次只改这一例，不要连着改两个代码块。

### 读「求和」

做完上一个再做这一例。代码收成一行是 `let s = 0; for (const n of [1, 2, 3, 4]) s += n; console.log(s);`。先盖住终端，用手算结果，纸上的文本里要能找到「10」。这是子串：前面可以有别的输出，后面通常有换行，不要要求整屏只有这几个字。

然后点这个代码块上的 Run，不要点工具栏。代码块会先备份草稿，再把示例写进编辑器并执行。终端里用眼睛找「10」。退出码不是 0 时，先读错误的类型和最后一行，此时不要改期望。退出码是 0 但找不到这段文字，说明打印了别的值，回到产生该值的表达式，只改一处。

改过之后再点代码块上的 Run，会把你的修改盖掉。要验证修改，点工具栏上的 Run。预测和新输出一致后，点撤销，把草稿还给自己。一次只改这一例，不要连着改两个代码块。

实践 1 写成一句就是：判断数组是否为空看 length，不看数组对象本身的真值。 用「空数组是真」当检查对象。删掉一个保护条件，或把比较符号反过来，看失败是报错还是静默地打出另一个数。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：最大值」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

实践 2 写成一句就是：遍历数组的值用 for...of，不用 for...in。 用「求和」当检查对象。把本该新建的对象改成复用已有的名字，看两个名字会不会一起变。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：最大值」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

实践 3 写成一句就是：switch 的每个 case 都写 break，除非贯穿是有意的并写了注释。 用「空数组是真」当检查对象。少写一个边界：少一次循环、少一个参数或少接住一个返回值，看输出正好差在哪。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：最大值」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

练习先不看折叠答案。题目是：用 for...of 找出 [4, 8, 1] 里的最大值并打印。 做完再对照「参考答案：最大值」。能说出自己的写法和答案差在哪一行，这道题才算完成。本章的另一道练习查的不是同一件事，两道都做。

收束时用一句话复述：分支看真值，循环用 for 或 for...of。switch 默认不会自己停下，要写 break。 若只能留下三句，就留下上面三条实践，并为每一条记住一个你刚刚故意做错的反例。

```js run expect="true" title="空数组是真"
const items = [];
console.log(Boolean(items));
console.log(items.length === 0);
```

```js run expect="10" title="求和"
let s = 0;
for (const n of [1, 2, 3, 4]) s += n;
console.log(s);
```

## 练习

用 for...of 求 `[1, 2, 3]` 的和。

::: answer 参考答案
```js run expect="6" title="参考答案"
let s = 0;
for (const n of [1, 2, 3]) s += n;
console.log(s);
```
:::

用 for...of 找出 [4, 8, 1] 里的最大值并打印。

::: answer 参考答案：最大值
```js run expect="8" title="参考答案"
let best = 0;
for (const n of [4, 8, 1]) if (n > best) best = n;
console.log(best);
```
:::

## 最佳实践

- 判断数组是否为空看 length，不看数组对象本身的真值。
- 遍历数组的值用 for...of，不用 for...in。
- switch 的每个 case 都写 break，除非贯穿是有意的并写了注释。

## 小结

分支看真值，循环用 for 或 for...of。switch 默认不会自己停下，要写 break。

## 常见错误

- case 后面忘记 break。
- for...in 遍历数组。它给出的是下标字符串，还可能带上额外的键。

## 延伸阅读

- [javascript.info](https://javascript.info/)（CC BY-NC-SA，仅链接）
- [Eloquent JavaScript](https://eloquentjavascript.net/)（CC BY-NC，仅链接）

## 参考与致谢

正文为原创。知识点范围参考了 MDN JavaScript Guide（CC BY-SA 2.5）和 Learn X in Y minutes — JavaScript（CC BY-SA 3.0）。TypeScript 章节的概念范围参考 TypeScript Handbook（CC BY 4.0）。没有逐字搬用这些文档。
