---
language: js
chapter: 26
title: "TypeScript 函数"
level: beginner
minutes: 8
goals:
  - "给箭头函数标注参数"
  - "用可选参数"
  - "写出函数类型"
sources:
  - lxiy-js
updated: "2026-10-15"
---

函数的类型写在参数和返回值上。调用时仍是 JavaScript 的调用。

### 箭头函数的参数类型

冒号后面是参数类型，括号外还可以写返回类型。

```ts run expect="8" title="加倍"
const twice = (n: number): number => n * 2;
console.log(twice(4));
```

输出里能看到 `8`。

### 可选参数

参数名后的问号表示可以不传。

```ts run expect="你好" title="省略"
function greet(name?: string): string {
  return name ? "你好，" + name : "你好";
}
console.log(greet());
```

输出里能看到 `你好`。

### 函数类型变量

变量可以声明成某种函数形状，再放进一个符合形状的函数。

```ts run expect="房号18" title="函数变量"
let read: (n: number) => string;
read = (n) => "房号" + n;
console.log(read(18));
```

输出里能看到 `房号18`。
