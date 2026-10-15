---
language: js
chapter: 10
title: "Promise 与 async"
level: advanced
minutes: 12
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

## 常见错误

- 忘记从 async 函数返回，调用者拿不到结果。
- Promise 构造函数里同步抛错却没 reject。用 reject 或让函数抛到 then 链外之前先包住。

## 延伸阅读

- [javascript.info](https://javascript.info/)（CC BY-NC-SA，仅链接）
- [Eloquent JavaScript](https://eloquentjavascript.net/)（CC BY-NC，仅链接）

## 参考与致谢

正文为原创。知识点范围参考了 MDN JavaScript Guide（CC BY-SA 2.5）和 Learn X in Y minutes — JavaScript（CC BY-SA 3.0）。TypeScript 章节的概念范围参考 TypeScript Handbook（CC BY 4.0）。没有逐字搬用这些文档。
