---
language: js
chapter: 10
title: "Promise 与 async"
level: advanced
minutes: 18
goals:
  - "链接已经完成的 Promise"
  - "用 async / await 写顺序"
  - "用 Promise.all 等待多项"
sources:
  - mdn-js
  - lxiy-js
updated: "2026-10-15"
---

Promise 表示一个将来的结果。这里没有计时器，也不要写 `setTimeout`：QuickJS 可能不会为它把进程留住。示例只用已经有结果的 Promise，微任务会在本次运行里完成。

`async` 函数返回 Promise。`await` 取出里面的值。

```js run expect="42" title="链接"
Promise.resolve(21)
  .then((n) => n * 2)
  .then((n) => console.log(n));
```

```js run expect="42" title="async"
async function main() {
  const n = await Promise.resolve(21);
  console.log(n * 2);
}
main();
```

```js run expect="5" title="Promise.all"
async function main() {
  const parts = await Promise.all([Promise.resolve(2), Promise.resolve(3)]);
  console.log(parts[0] + parts[1]);
}
main();
```

```js norun title="不用计时器"
// 只读：不要靠 setTimeout 制造先后。
// setTimeout(() => console.log(1), 0);
```

Promise 代表一份将来的结果。本环境不把进程留住等计时器，所以示例只用 Promise.resolve 和 Promise.reject。它们的 then 和 await 会在当前这次运行的微任务里完成，console.log 能看见结果。

async 函数总是返回 Promise。里面 return 的值会被包起来，抛出的异常会变成拒绝。await 取出成功的值，拒绝则抛到 await 所在的 try。忘记 await，你拿到的是 Promise 对象，打印出来不是数字。

Promise.all 等全部成功。其中一个拒绝，整个 all 拒绝。all 适合一批互不依赖的已完成任务。有先后依赖时写成前后两个 await，不要用 all 硬凑。

不要写 setTimeout(..., 0) 来「等到最后」。这里它可能根本不会跑。顺序如果重要，就写在同一个 async 函数里，从上往下 await。

微任务会在当前调用栈清空后立刻运行。所以脚本末尾调用 main()，后面即使没有更多语句，then 里的 log 仍会出现在这次输出里。不要把 Promise 的结果当成要等几秒。

拒绝如果没有任何 catch，引擎会报告未处理的拒绝。示例一律把 await 放在 try 里，或者在 then 后面跟 catch。测试看的是你打印的那一行，不是引擎的警告文本。

Promise.all 的结果数组顺序和输入顺序一致，不是完成顺序。这里的输入都是已完成的，顺序问题不大，但写的时候按输入顺序读取，不要排序。

这里只用已经完成的 Promise。Promise.resolve 和 Promise.reject 在这次运行里就会结算。async 函数返回 Promise，await 等待它。脚本末尾调用 async 函数之后，微任务会在当前栈清空后跑完，所以 console.log 仍会出现在这次输出里。不要把这理解成要等几秒，也不要写 setTimeout 来排队。

忘记 await 时，你拿到的是 Promise 对象，打印出来不是里面的数。对比示例故意写成 await 之后再打印，让你看见数本身。Promise.all 要等全部成功；其中一个 reject，整个 all 就失败，要在外面 catch。catch 里打印固定的词，不要打印错误栈的全文当期望。

then 和 await 描述同一件事。教程里能写成 await 的就写成 await，少嵌套。错误用 try/catch 包住 await，和同步代码的形状一样。不要吞掉 reject。没有 catch 的拒绝在这个环境里会变成失败的运行，退出码不是零。

链式调用时，上一环返回的值才是下一环的输入。返回一个新的 Promise.resolve，和直接返回数，在 await 之后看起来一样。练习保持一层，先把「已经完成」和「忘记等待」分清。

### 读「忘记 await 的对比」

先做这一例。代码收成一行是 `async function main() { const p = Promise.resolve(42); console.log(await p); } main();`。先盖住终端，用手算结果，纸上的文本里要能找到「42」。这是子串：前面可以有别的输出，后面通常有换行，不要要求整屏只有这几个字。

然后点这个代码块上的 Run，不要点工具栏。代码块会先备份草稿，再把示例写进编辑器并执行。终端里用眼睛找「42」。退出码不是 0 时，先读错误的类型和最后一行，此时不要改期望。退出码是 0 但找不到这段文字，说明打印了别的值，回到产生该值的表达式，只改一处。

改过之后再点代码块上的 Run，会把你的修改盖掉。要验证修改，点工具栏上的 Run。预测和新输出一致后，点撤销，把草稿还给自己。一次只改这一例，不要连着改两个代码块。

### 读「all 拒绝」

做完上一个再做这一例。代码收成一行是 `async function main() { try { await Promise.all([Promise.resolve(1), Promise.reject(new Error('x'))]); } catch (err) { console.log('rejected'); } } main();`。先盖住终端，用手算结果，纸上的文本里要能找到「rejected」。这是子串：前面可以有别的输出，后面通常有换行，不要要求整屏只有这几个字。

然后点这个代码块上的 Run，不要点工具栏。代码块会先备份草稿，再把示例写进编辑器并执行。终端里用眼睛找「rejected」。退出码不是 0 时，先读错误的类型和最后一行，此时不要改期望。退出码是 0 但找不到这段文字，说明打印了别的值，回到产生该值的表达式，只改一处。

改过之后再点代码块上的 Run，会把你的修改盖掉。要验证修改，点工具栏上的 Run。预测和新输出一致后，点撤销，把草稿还给自己。一次只改这一例，不要连着改两个代码块。

实践 1 写成一句就是：不用 setTimeout。顺序写在 async 函数里。 用「忘记 await 的对比」当检查对象。删掉一个保护条件，或把比较符号反过来，看失败是报错还是静默地打出另一个数。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：乘二」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

实践 2 写成一句就是：await 每一个你关心结果的 Promise，不要打印 Promise 对象本身。 用「all 拒绝」当检查对象。把本该新建的对象改成复用已有的名字，看两个名字会不会一起变。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：乘二」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

实践 3 写成一句就是：互不依赖才用 Promise.all，有先后就分开 await。 用「忘记 await 的对比」当检查对象。少写一个边界：少一次循环、少一个参数或少接住一个返回值，看输出正好差在哪。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：乘二」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

练习先不看折叠答案。题目是：await Promise.resolve(21)，乘 2 后打印。 做完再对照「参考答案：乘二」。能说出自己的写法和答案差在哪一行，这道题才算完成。本章的另一道练习查的不是同一件事，两道都做。

收束时用一句话复述：这里只用已经完成的 Promise。async 和 await 把它们写成顺序语句，计时器不在本环境的保证之内。 若只能留下三句，就留下上面三条实践，并为每一条记住一个你刚刚故意做错的反例。

```js run expect="42" title="忘记 await 的对比"
async function main() {
  const p = Promise.resolve(42);
  console.log(await p);
}
main();
```

```js run expect="rejected" title="all 拒绝"
async function main() {
  try {
    await Promise.all([Promise.resolve(1), Promise.reject(new Error('x'))]);
  } catch (err) {
    console.log('rejected');
  }
}
main();
```

## 练习

await 一个拒绝的 Promise，catch 后打印「失败」。

::: answer 参考答案
```js run expect="失败" title="参考答案"
async function main() {
  try {
    await Promise.reject(new Error("x"));
  } catch (err) {
    console.log("失败");
  }
}
main();
```
:::

await Promise.resolve(21)，乘 2 后打印。

::: answer 参考答案：乘二
```js run expect="42" title="参考答案"
async function main() {
  const n = await Promise.resolve(21);
  console.log(n * 2);
}
main();
```
:::

## 最佳实践

- 不用 setTimeout。顺序写在 async 函数里。
- await 每一个你关心结果的 Promise，不要打印 Promise 对象本身。
- 互不依赖才用 Promise.all，有先后就分开 await。

## 小结

这里只用已经完成的 Promise。async 和 await 把它们写成顺序语句，计时器不在本环境的保证之内。

## 常见错误

- 忘记从 async 函数返回，调用者拿不到结果。
- Promise 构造函数里同步抛错却没 reject。用 reject 或让函数抛到 then 链外之前先包住。

## 延伸阅读

- [javascript.info](https://javascript.info/)（CC BY-NC-SA，仅链接）
- [Eloquent JavaScript](https://eloquentjavascript.net/)（CC BY-NC，仅链接）

## 参考与致谢

正文为原创。知识点范围参考了 MDN JavaScript Guide（CC BY-SA 2.5）和 Learn X in Y minutes — JavaScript（CC BY-SA 3.0）。TypeScript 章节的概念范围参考 TypeScript Handbook（CC BY 4.0）。没有逐字搬用这些文档。
