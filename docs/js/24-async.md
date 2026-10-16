---
language: js
chapter: 24
title: "JavaScript async/await"
level: beginner
minutes: 8
goals:
  - "用 async 函数等待已经完成的值"
  - "把 await 放进函数而不是文件顶层"
  - "用 try 接住 await 的失败"
sources:
  - lxiy-js
updated: "2026-10-15"
---

顶层 `await` 取决于脚本是不是模块。课程里把 `await` 放进 `async` 函数再调用。

### await 已完成的值

`await` 一个已经成功的 Promise，得到里面的值。

```js run expect="tea" title="等到茶"
async function run() {
  const name = await Promise.resolve("tea");
  console.log(name);
}
run();
```

输出里能看到 `tea`。

### 顺序等待

两步都已经完成，打印的仍是先写的那一步的结果。

```js run expect="5" title="两步"
async function run() {
  const a = await Promise.resolve(2);
  const b = await Promise.resolve(a + 3);
  console.log(b);
}
run();
```

输出里能看到 `5`。

### 失败进 catch

`await` 一个被拒绝的 Promise，会抛进 `try`。

```js run expect="caught" title="拒绝"
async function run() {
  try {
    await Promise.reject(new Error("lack"));
    console.log("passed");
  } catch (err) {
    console.log("caught");
  }
}
run();
```

输出里能看到 `caught`。
