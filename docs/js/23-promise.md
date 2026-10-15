---
language: js
chapter: 23
title: "JavaScript Promise"
level: beginner
minutes: 8
goals:
  - "用已经完成的 Promise 排队"
  - "看出同步代码先于 then"
  - "用 catch 接住拒绝"
sources:
  - lxiy-js
updated: "2026-10-15"
---

这里没有网络。`Promise.resolve` 表示值已经有了，`then` 仍排到当前同步代码之后。

### 同步先走

数组先记下同步的字，微任务再补上结果，最后一次打印。

```js run expect="先-茶" title="先同步"
function run() {
  const log = [];
  const chain = Promise.resolve("茶").then(function (name) {
    log.push(name);
  });
  log.push("先");
  return chain.then(function () {
    console.log(log.join("-"));
  });
}
run();
```

输出里能看到 `先-茶`。

### then 传递返回值

回调的返回值交给下一段。

```js run expect="3" title="加一"
function run() {
  return Promise.resolve(2).then(function (n) {
    return n + 1;
  }).then(function (n) {
    console.log(n);
  });
}
run();
```

输出里能看到 `3`。

### catch

在 `then` 里抛出，后面的 `catch` 会接到。

```js run expect="接住" title="失败分支"
function run() {
  return Promise.resolve(1).then(function () {
    throw new Error("缺");
  }).catch(function () {
    console.log("接住");
  });
}
run();
```

输出里能看到 `接住`。
