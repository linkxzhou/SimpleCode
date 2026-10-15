---
language: js
chapter: 7
title: "类与原型"
level: intermediate
minutes: 12
goals:
  - "用 class 声明方法"
  - "用 extends 复用"
  - "知道方法找得到是因为原型链"
sources:
  - mdn-js
  - lxiy-js
updated: "2026-10-15"
---

`class` 是原型的语法。方法放在原型上，实例自己的字段放在对象上。`extends` 把原型连起来，子类构造函数要先 `super`。

`instanceof` 沿着这条链判断。

```js run expect="12" title="矩形"
class Rect {
  constructor(w, h) {
    this.w = w;
    this.h = h;
  }
  area() {
    return this.w * this.h;
  }
}
console.log(new Rect(3, 4).area());
```

```js run expect="7" title="栈"
class Stack {
  constructor() {
    this.items = [];
  }
  push(v) {
    this.items.push(v);
  }
  pop() {
    return this.items.pop();
  }
}
const s = new Stack();
s.push(7);
console.log(s.pop());
```

```js run expect="meow" title="继承"
class Animal {
  speak() {
    return "...";
  }
}
class Cat extends Animal {
  speak() {
    return "meow";
  }
}
const pet = new Cat();
console.log(pet.speak());
console.log(pet instanceof Animal);
```

## 练习

写一个 Queue，enqueue 再 dequeue，打印先放进去的 1。

::: answer 参考答案
```js run expect="1" title="参考答案"
class Queue {
  constructor() { this.items = []; }
  enqueue(v) { this.items.push(v); }
  dequeue() { return this.items.shift(); }
}
const q = new Queue();
q.enqueue(1);
q.enqueue(2);
console.log(q.dequeue());
```
:::

## 常见错误

- 在子类构造函数里先用 this 再 super。
- 把方法直接赋到实例上却以为改的是所有对象。那只影响这一个实例。

## 延伸阅读

- [javascript.info](https://javascript.info/)（CC BY-NC-SA，仅链接）
- [Eloquent JavaScript](https://eloquentjavascript.net/)（CC BY-NC，仅链接）

## 参考与致谢

正文为原创。知识点范围参考了 MDN JavaScript Guide（CC BY-SA 2.5）和 Learn X in Y minutes — JavaScript（CC BY-SA 3.0）。TypeScript 章节的概念范围参考 TypeScript Handbook（CC BY 4.0）。没有逐字搬用这些文档。
