---
language: js
chapter: 30
title: "JavaScript 闭包"
level: intermediate
minutes: 10
goals:
  - "让内层函数记住外层的计数"
  - "用参数躲开循环里的共享变量"
  - "返回两个互相看见的函数"
sources:
  - mdn-js
  - lxiy-js
updated: "2026-10-20"
---

闭包是内层函数带走外层绑定。这里没有页面，例子只打印数字，方便在 QuickJS 里对答案。

### 每次调用都加一

counter 把 n 留在外层。返回的函数每次把 n 加 1 再交出来。从 10 开始，两下调用是 11 和 12，加起来是 23。

```js run expect="23" title="两次加一"
function counter(start) {
  let n = start;
  return function () {
    n += 1;
    return n;
  };
}
const next = counter(10);
console.log(next() + next());
```

两次相加是 23。

### let 让每一圈有自己的 i

for 里用 let，每次循环的 i 是新绑定。三个函数分别记住 0、1、2。下标 0 和下标 2 相加是 2。

```js run expect="2" title="三圈"
function makeReaders() {
  const fns = [];
  for (let i = 0; i < 3; i += 1) {
    fns.push(function () { return i; });
  }
  return fns;
}
const fns = makeReaders();
console.log(fns[0]() + fns[2]());
```

0 加 2 是 2。

### 两个函数共用一个数组

makeBox 返回 push 和 size。它们看见同一份 items。推进 tea 以后，size 是 1。

```js run expect="1" title="盒子"
function makeBox() {
  const items = [];
  return {
    push(name) { items.push(name); },
    size() { return items.length; },
  };
}
const box = makeBox();
box.push("tea");
console.log(box.size());
```

盒子里有 1 个名字。

### 练习：从 0 连加三次

做一个从 0 开始的闭包，调用三次再把三次的返回值相加。1+2+3 应是 6。

```js run expect="6" title="三次之和"
function ticker() {
  let n = 0;
  return function () {
    n += 1;
    return n;
  };
}
const tick = ticker();
console.log(tick() + tick() + tick());
```

三次之和是 6。

### You Don't Know JS 只作链接

You Don't Know JS 是 CC-BY-NC-ND，不能改编，需要时自己打开：<https://github.com/getify/You-Dont-Know-JS> 。
