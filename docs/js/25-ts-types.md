---
language: js
chapter: 25
title: "TypeScript 基础类型"
level: beginner
minutes: 8
goals:
  - "给变量写上类型"
  - "知道运行前类型会被去掉"
  - "打印一条仍带类型标注的标题"
sources:
  - lxiy-js
updated: "2026-10-15"
---

类型写在名字旁边。运行前 Sucrase 会去掉类型，编辑器里能看到转译说明。

### 字符串标注

第一个 TypeScript 例子打印 buypen。类型只在源码里，输出仍是这个词。

```ts run expect="buypen" title="一条标题"
const item: string = "buypen";
console.log(item);
```

输出里能看到 `buypen`。

### 数字标注

参数和返回值都可以标注。去掉类型之后就是普通函数。

```ts run expect="5" title="带类型的加法"
function add(a: number, b: number): number {
  return a + b;
}
console.log(add(2, 3));
```

输出里能看到 `5`。

### 布尔

`boolean` 只有 true 和 false。

```ts run expect="true" title="布尔"
const open: boolean = true;
console.log(open);
```

输出里能看到 `true`。
