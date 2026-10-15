---
language: js
chapter: 9
title: "迭代器与生成器"
level: advanced
minutes: 18
goals:
  - "让对象能被 for...of"
  - "用 function* 产出序列"
  - "只取前几项"
sources:
  - mdn-js
  - lxiy-js
updated: "2026-10-15"
---

`for...of` 会找 `Symbol.iterator`。生成器函数返回的对象自带这个方法，`yield` 一次给一个值。

不要依赖 `setTimeout`。需要「稍后」时，用已经完成的 Promise，下一章再讲。

```js run expect="6" title="范围"
function* range(start, end) {
  for (let n = start; n <= end; n++) yield n;
}
let sum = 0;
for (const n of range(1, 3)) sum += n;
console.log(sum);
```

```js run expect="0,1,1,2,3,5" title="斐波那契"
function* fibs() {
  let a = 0;
  let b = 1;
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}
const out = [];
for (const n of fibs()) {
  if (out.length === 6) break;
  out.push(n);
}
console.log(out.join(","));
```

```js run expect="3,1" title="自定义迭代"
const bag = {
  data: [3, 1],
  [Symbol.iterator]() {
    let i = 0;
    const data = this.data;
    return {
      next() {
        if (i < data.length) return { value: data[i++], done: false };
        return { done: true };
      },
    };
  },
};
console.log([...bag].join(","));
```

for...of 要求对象有 Symbol.iterator。数组、字符串、Map、生成器都有。普通对象默认没有，用 for...of 会抛错。想遍历对象的键，用 Object.keys。

生成器函数 function* 返回生成器。yield 暂停并交出一个值。生成器只能走一遍。无限生成器必须在循环里 break，不能展开成数组。

自定义迭代器要提供 next 方法，返回 { value, done }。done 为 true 时 for 停止。value 在结束时可以省略。把这个对象从 Symbol.iterator 返回，for...of 就会用它。

解构和展开也会消费迭代器。[...gen] 会把剩余值全部取出。对无限生成器这样做不会结束。先取有限个，再展开那一部分。

手写迭代器时，闭包记住下标。next 每次把下标加一。下标超过长度就返回 done: true。忘记 done，for 会无限循环，因为 value 变成 undefined 但仍被当成有效元素。

生成器里的 return 会结束生成器。yield 之后的代码要等下一次 next 才执行。第一次调用函数只是创建生成器，函数体要到第一次 next 或 for 才真正开始。这常让人以为「函数没运行」。

字符串也可以 for...of，按码点遍历。和按下标取 UTF-16 单元不完全一样。本章例子用 ASCII，避开这个差别。

for...of 要求对象有迭代器。数组、字符串、map 都可以。普通对象默认不能 for...of，要用 Object.keys 或 Object.entries。Object.keys 的顺序对断言不重要，测试打印键的个数或某个具体的值。

生成器用 function* 和 yield 写出。每次 next 产出一个值，展开或 for...of 会把能产出的值取完。无限生成器不能展开成数组。取用时写明只要前几项。生成器只能走一遍，走完再遍历就是空的。需要再来一次就再调用生成器函数，得到一个新的。

手写迭代器时，next 返回 done 和 value。忘记 done，循环会把 undefined 当成有效元素一直走。闭包记住下标，每次加一，超过长度就 done。不要在迭代器里做输入输出以外的副作用，否则读的人无法预测下一项。

解构可以一次取走迭代器的前几项。取走之后，剩下的项还在，但已经被消费的不会回来。练习如果只取前两项，期望里就不要再假设第一项还能再读到。

### 读「Object.keys」

先做这一例。代码收成一行是 `console.log(Object.keys({ b: 1, a: 2 }).length);`。先盖住终端，用手算结果，纸上的文本里要能找到「2」。这是子串：前面可以有别的输出，后面通常有换行，不要要求整屏只有这几个字。

然后点这个代码块上的 Run，不要点工具栏。代码块会先备份草稿，再把示例写进编辑器并执行。终端里用眼睛找「2」。退出码不是 0 时，先读错误的类型和最后一行，此时不要改期望。退出码是 0 但找不到这段文字，说明打印了别的值，回到产生该值的表达式，只改一处。

改过之后再点代码块上的 Run，会把你的修改盖掉。要验证修改，点工具栏上的 Run。预测和新输出一致后，点撤销，把草稿还给自己。一次只改这一例，不要连着改两个代码块。

### 读「有限展开」

做完上一个再做这一例。代码收成一行是 `function* two() { yield 1; yield 2; } console.log([...two()].join(','));`。先盖住终端，用手算结果，纸上的文本里要能找到「1,2」。这是子串：前面可以有别的输出，后面通常有换行，不要要求整屏只有这几个字。

然后点这个代码块上的 Run，不要点工具栏。代码块会先备份草稿，再把示例写进编辑器并执行。终端里用眼睛找「1,2」。退出码不是 0 时，先读错误的类型和最后一行，此时不要改期望。退出码是 0 但找不到这段文字，说明打印了别的值，回到产生该值的表达式，只改一处。

改过之后再点代码块上的 Run，会把你的修改盖掉。要验证修改，点工具栏上的 Run。预测和新输出一致后，点撤销，把草稿还给自己。一次只改这一例，不要连着改两个代码块。

实践 1 写成一句就是：普通对象不要 for...of，用 Object.keys 或 Object.entries。 用「Object.keys」当检查对象。删掉一个保护条件，或把比较符号反过来，看失败是报错还是静默地打出另一个数。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：两数相乘」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

实践 2 写成一句就是：无限生成器必须限制次数，禁止直接展开。 用「有限展开」当检查对象。把本该新建的对象改成复用已有的名字，看两个名字会不会一起变。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：两数相乘」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

实践 3 写成一句就是：生成器走完就空了，需要再来一遍就重新调用函数。 用「Object.keys」当检查对象。少写一个边界：少一次循环、少一个参数或少接住一个返回值，看输出正好差在哪。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：两数相乘」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

练习先不看折叠答案。题目是：生成器产出 3 和 4，打印它们的积。 做完再对照「参考答案：两数相乘」。能说出自己的写法和答案差在哪一行，这道题才算完成。本章的另一道练习查的不是同一件事，两道都做。

收束时用一句话复述：for...of 依赖迭代器。生成器按需产出值，只能走一遍，无限序列必须在取用时停下来。 若只能留下三句，就留下上面三条实践，并为每一条记住一个你刚刚故意做错的反例。

```js run expect="2" title="Object.keys"
console.log(Object.keys({ b: 1, a: 2 }).length);
```

```js run expect="1,2" title="有限展开"
function* two() { yield 1; yield 2; }
console.log([...two()].join(','));
```

## 练习

生成器产出 2 和 4，打印它们的和。

::: answer 参考答案
```js run expect="6" title="参考答案"
function* evens() {
  yield 2;
  yield 4;
}
let s = 0;
for (const n of evens()) s += n;
console.log(s);
```
:::

生成器产出 3 和 4，打印它们的积。

::: answer 参考答案：两数相乘
```js run expect="12" title="参考答案"
function* pair() { yield 3; yield 4; }
const [a, b] = pair();
console.log(a * b);
```
:::

## 最佳实践

- 普通对象不要 for...of，用 Object.keys 或 Object.entries。
- 无限生成器必须限制次数，禁止直接展开。
- 生成器走完就空了，需要再来一遍就重新调用函数。

## 小结

for...of 依赖迭代器。生成器按需产出值，只能走一遍，无限序列必须在取用时停下来。

## 常见错误

- 对无限生成器直接展开成数组。先限制次数。
- 生成器只能走一遍。再 for 一次不会重新开始，需要再调用函数。

## 延伸阅读

- [javascript.info](https://javascript.info/)（CC BY-NC-SA，仅链接）
- [Eloquent JavaScript](https://eloquentjavascript.net/)（CC BY-NC，仅链接）

## 参考与致谢

正文为原创。知识点范围参考了 MDN JavaScript Guide（CC BY-SA 2.5）和 Learn X in Y minutes — JavaScript（CC BY-SA 3.0）。TypeScript 章节的概念范围参考 TypeScript Handbook（CC BY 4.0）。没有逐字搬用这些文档。
