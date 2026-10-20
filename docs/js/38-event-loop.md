---
language: js
chapter: 38
title: "JavaScript 事件循环与微任务"
level: advanced
minutes: 11
goals:
  - "看出同步代码先于 then"
  - "在微任务里再排一个微任务"
  - "知道 setTimeout 会把这次运行挂住"
sources:
  - mdn-js
  - lxiy-js
updated: "2026-10-20"
---

Promise.then 把函数排进微任务。当前这段同步代码走完，才会去跑已经排好的微任务。setTimeout 在这份 QuickJS 里不会按时回来，调用它会让运行停住，所以只供阅读。

### 同步的 A 和 C 先出现

A 和 C 是同步推进去的。B 和 D 在 then 里。打印发生在第二个 then 的末尾，所以顺序是 A、C、B、D。

```js run expect="ACBD" title="同步优先"
const log = [];
log.push("A");
Promise.resolve().then(function () { log.push("B"); });
log.push("C");
Promise.resolve().then(function () {
  log.push("D");
  console.log(log.join(""));
});
```

顺序是 ACBD。

### 里层 then 排在已有微任务之后

第一个 then 推进 B，并再排一个推进 inner 的 then。打印放在更早排好的 then 里，所以 inner 还没写进日志。看到的是 ACB。

```js run expect="ACB" title="里层还没到"
const log = [];
log.push("A");
Promise.resolve().then(function () {
  log.push("B");
  Promise.resolve().then(function () { log.push("inner"); });
});
log.push("C");
Promise.resolve().then(function () { console.log(log.join("")); });
```

这一行是 ACB。

### setTimeout 不要运行

计时器回调要等脚本把控制权交回去。这份宿主会停在计时器上，文档冒烟等不到结束。下面的 now 和 later 只给人看。

```js norun title="计时器会停住"
setTimeout(function () { console.log("later"); }, 0);
console.log("now");
```

这段只供阅读。

### 练习：三个微任务按序排队

同步只放 S。三个 then 依次放 1、2、3，最后一个负责打印。结果应是 S123。

```js run expect="S123" title="三个微任务"
const log = ["S"];
Promise.resolve().then(function () { log.push("1"); });
Promise.resolve().then(function () { log.push("2"); });
Promise.resolve().then(function () {
  log.push("3");
  console.log(log.join(""));
});
```

排出来是 S123。

### MDN 的事件循环说明

MDN 把宏任务和微任务写得更全，许可 CC-BY-SA：<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide> 。
