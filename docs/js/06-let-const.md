---
language: js
chapter: 6
title: "JavaScript let 和 const"
level: beginner
minutes: 8
goals:
  - "用 const 绑定不再整体替换的名字"
  - "知道 const 对象仍能改字段"
  - "不再使用 var"
sources:
  - lxiy-js
updated: "2026-10-15"
---

`const` 不能再指向另一个值。对象里面的字段仍然可以改。

### const 不能重新赋值

想换整个绑定，用 `let`。

```js run expect="3" title="固定绑定"
const n = 3;
console.log(n);
```

输出里能看到 `3`。

### 对象字段可以改

`const` 锁的是绑定，不是对象内部。

```js run expect="7" title="改字段"
const cup = { ml: 8 };
cup.ml = 7;
console.log(cup.ml);
```

输出里能看到 `7`。

### var 不在课程例子里

`var` 会提升到函数顶，容易在声明前读到 `undefined`。新代码用 `let` 和 `const`。

```js norun title="先读后声明"
console.log(n);
var n = 1;
```
