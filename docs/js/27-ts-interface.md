---
language: js
chapter: 27
title: "TypeScript 接口"
level: beginner
minutes: 8
goals:
  - "用 interface 描述对象"
  - "知道多出来的检查发生在转译前"
  - "按接口读取字段"
sources:
  - lxiy-js
updated: "2026-10-15"
---

接口只在类型层面存在。转译之后字段访问还是普通的点号。

### 描述一个对象

对象至少要有接口列出的字段。

```ts run expect="18" title="单价"
interface Item {
  name: string;
  price: number;
}
const item: Item = { name: "茶", price: 18 };
console.log(item.price);
```

输出里能看到 `18`。

### 只读字段仍能读

`readonly` 阻止再赋值。读取不受影响。

```ts run expect="茶" title="读名称"
interface Item {
  readonly name: string;
}
const item: Item = { name: "茶" };
console.log(item.name);
```

输出里能看到 `茶`。

### 可选字段

问号表示字段可以没有。没有时打印 `undefined`。

```ts run expect="undefined" title="没有备注"
interface Item {
  name: string;
  note?: string;
}
const item: Item = { name: "茶" };
console.log(item.note);
```

输出里能看到 `undefined`。
