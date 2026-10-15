---
language: js
chapter: 11
title: "TypeScript 入门"
level: advanced
minutes: 14
goals:
  - "给参数和返回值加类型"
  - "用 interface 描述对象"
  - "知道这里只去类型、不做检查"
sources:
  - mdn-js
  - ts-handbook
  - lxiy-js
updated: "2026-10-15"
---

`ts` 代码块会用项目里的 Sucrase 去掉类型，再交给 QuickJS。没有类型检查：错误的标注也会跑。编辑器里放的是转译后的 JavaScript，第一行注释说明原文在文档里。

联合类型在运行时就是普通的值，收窄要自己判断。

```ts run expect="买笔" title="待办"
interface Todo {
  title: string;
  done: boolean;
}
const item: Todo = { title: "买笔", done: false };
console.log(item.title);
```

```ts run expect="42" title="标注函数"
function add(a: number, b: number): number {
  return a + b;
}
console.log(add(20, 22));
```

```ts run expect="n:7" title="联合类型"
type Id = string | number;
function show(x: Id): string {
  if (typeof x === "number") return "n:" + x;
  return "s:" + x;
}
console.log(show(7));
```

## 练习

写一个泛型函数 identity，传入 42 再打印。类型参数会被去掉，运行结果与普通函数相同。

::: answer 参考答案
```ts run expect="42" title="参考答案"
function identity<T>(value: T): T {
  return value;
}
console.log(identity(42));
```
:::

## 常见错误

- 指望转译器拒绝错误类型。Sucrase 只删除类型。
- 在 ts 块里写 import。转译后仍然是单文件，没有模块加载。

## 延伸阅读

- [javascript.info](https://javascript.info/)（CC BY-NC-SA，仅链接）
- [Eloquent JavaScript](https://eloquentjavascript.net/)（CC BY-NC，仅链接）

## 参考与致谢

正文为原创。知识点范围参考了 MDN JavaScript Guide（CC BY-SA 2.5）和 Learn X in Y minutes — JavaScript（CC BY-SA 3.0）。TypeScript 章节的概念范围参考 TypeScript Handbook（CC BY 4.0）。没有逐字搬用这些文档。
