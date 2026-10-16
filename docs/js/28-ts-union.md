---
language: js
chapter: 28
title: "TypeScript 联合类型"
level: beginner
minutes: 8
goals:
  - "用竖线表示多种可能"
  - "在使用前判断类型"
  - "用字面量类型限制取值"
sources:
  - lxiy-js
updated: "2026-10-15"
---

联合类型表示值可能是其中一种。判断之后再使用对应的操作。

### 字符串或数字

先看 `typeof`，再决定怎么打印。

```ts run expect="num3" title="数字一支"
function show(value: string | number): string {
  if (typeof value === "number") return "num" + value;
  return value;
}
console.log(show(3));
```

输出里能看到 `num3`。

### 另一支

传入字符串时走另一支。

```ts run expect="texttea" title="文本一支"
function show(value: string | number): string {
  if (typeof value === "number") return "num";
  return "text" + value;
}
console.log(show("tea"));
```

输出里能看到 `texttea`。

### 字面量联合

只允许列出的几个字符串。

```ts run expect="small" title="字面量"
type Size = "small" | "big";
const size: Size = "small";
console.log(size);
```

输出里能看到 `small`。
