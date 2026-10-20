---
language: js
chapter: 39
title: "TypeScript 泛型"
level: advanced
minutes: 11
goals:
  - "写一个把值原样交回的泛型函数"
  - "用 extends 要求有 length"
  - "给盒子标上类型参数"
sources:
  - mdn-js
  - ts-handbook
  - lxiy-js
updated: "2026-10-20"
---

泛型在转译时会被擦掉。Sucrase 去掉类型之后，QuickJS 只看见普通函数。例子要在擦掉类型以后仍然能跑，并且打印的是值，不是类型。

### 原样交回字符串

identity 的类型参数 T 跟着实参走。传入 tea，擦掉类型以后就是把参数 return 回去，打印 tea。

```ts run expect="tea" title="原样返回"
function identity<T>(value: T): T {
  return value;
}
console.log(identity<string>("tea"));
```

交回来的是 tea。

### 只接受有长度的值

longest 要求 T 有 length。两个字符串比长度，cupboard 比 tea 长，所以交回 cupboard。比较发生在运行时，约束只在转译前有意义。

```ts run expect="cupboard" title="更长的那个"
function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}
console.log(longest("tea", "cupboard"));
```

更长的是 cupboard。

### 盒子记住一种值

Box<T> 的 get 交回放进去的值。这里放数字 4，乘 2 得到 8。类型参数不会在运行时造出一个真正的容器类型。

```ts run expect="8" title="数字盒子"
class Box<T> {
  value: T;
  constructor(value: T) { this.value = value; }
  get(): T { return this.value; }
}
const box = new Box<number>(4);
console.log(box.get() * 2);
```

取出来再乘是 8。

### 练习：取数组的第一项

写 first<T>，返回 items[0]。传入 oak 和 elm，应打印 oak。

```ts run expect="oak" title="第一项"
function first<T>(items: T[]): T {
  return items[0];
}
console.log(first(["oak", "elm"]));
```

第一项是 oak。

### 手册里的泛型章节

TypeScript 手册的泛型页是 CC-BY-4.0，可以对照，本章函数是另写的：<https://www.typescriptlang.org/docs/handbook/intro.html> 。
